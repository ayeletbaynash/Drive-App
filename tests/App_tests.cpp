#include <gtest/gtest.h>
#include <sstream>
#include <string>
#include <map>
#include "Input.h"
#include "Output.h"
#include "ICommand.h"
#include "ICompress.h"
#include "App.h"

// -----------------------------
// Fake Classes for Testing
// -----------------------------

class FakeInput : public Input {
public:
    FakeInput(std::istream& in) : Input(in) {}
    std::string read() {
        std::string line;
        if (!std::getline(get_stream(), line)) return "exit";
        return line;
    }
};

class FakeOutput : public Output {
public:
    FakeOutput(std::ostream& s) : Output(s) {}
    void write(const std::string& out) {
        std::cout << out << std::endl;
    }
};

class FakeCompress : public ICompress {
public:
    std::string compress(const std::string& raw_data) override {
        return raw_data; 
    }
    std::string decompress(const std::string& compressed_data) override {
        return compressed_data; 
    }
};

class FakeCommand : public ICommand {
public:
    std::vector<std::string> called_with;
    void execute(const std::string& file_info, ICompress* compressor, Output* output) override {
        called_with.push_back(file_info);
    }
};

// -----------------------------
// TESTS
// -----------------------------

TEST(AppTest, CallsCorrectCommand) {
    std::istringstream input_stream("add file1 hello\nget file1\nsearch abc\nexit\n");
    std::ostringstream output_stream;

    FakeInput input(input_stream);
    FakeOutput output(output_stream);
    FakeCompress compress;

    FakeCommand addCmd, getCmd, searchCmd;

    App app(&input, &output, &compress, {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
    });

    app.run();

    ASSERT_EQ(addCmd.called_with.size(), 1);
    EXPECT_EQ(addCmd.called_with[0], "file1 hello");

    ASSERT_EQ(getCmd.called_with.size(), 1);
    EXPECT_EQ(getCmd.called_with[0], "file1");

    ASSERT_EQ(searchCmd.called_with.size(), 1);
    EXPECT_EQ(searchCmd.called_with[0], "abc");
}

TEST(AppTest, HandlesEmptyInput) {
    std::istringstream input_stream("\nexit\n");
    std::ostringstream output_stream;

    FakeInput input(input_stream);
    FakeOutput output(output_stream);
    FakeCompress compress;
    FakeCommand addCmd;

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();

    EXPECT_TRUE(addCmd.called_with.empty());
}

TEST(AppTest, CommandWithoutContent) {
    std::istringstream input_stream("add file1 content\nexit\n");
    std::ostringstream output_stream;

    FakeInput input(input_stream);
    FakeOutput output(output_stream);
    FakeCompress compress;
    FakeCommand addCmd;

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();

    ASSERT_EQ(addCmd.called_with.size(), 1);
    EXPECT_EQ(addCmd.called_with[0], "file1 content");
}

TEST(AppTest, UnknownCommand) {
    std::istringstream input_stream("delete file1\nexit\n");
    std::ostringstream output_stream;

    FakeInput input(input_stream);
    FakeOutput output(output_stream);
    FakeCompress compress;

    App app(&input, &output, &compress, {});
    app.run();

    // for unknown command
    SUCCEED();
}

TEST(AppTest, MixedSequenceOfCommands) {
    std::istringstream input_stream(
        "add f1 a\nsearch a\nget f1\n add file 1 invalid\nunknown\nexit\n"
    );
    std::ostringstream output_stream;

    FakeInput input(input_stream);
    FakeOutput output(output_stream);
    FakeCompress compress;

    FakeCommand addCmd, searchCmd, getCmd;

    App app(&input, &output, &compress, {
        {"add", &addCmd},
        {"search", &searchCmd},
        {"get", &getCmd}
    });

    app.run();

    ASSERT_EQ(addCmd.called_with.size(), 1);
    EXPECT_EQ(addCmd.called_with[0], "f1 a");

    ASSERT_EQ(searchCmd.called_with.size(), 1);
    EXPECT_EQ(searchCmd.called_with[0], "a");

    ASSERT_EQ(getCmd.called_with.size(), 1);
    EXPECT_EQ(getCmd.called_with[0], "f1");
}

TEST(AppTest, IgnoresLineStartingWithSpace) {
    std::istringstream input_stream(" add file1 hello\nexit\n"); // Space before command
    std::ostringstream output_stream;

    FakeInput input(input_stream);
    FakeOutput output(output_stream);
    FakeCompress compress;
    FakeCommand addCmd;

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();

    // There shouldn't be any call to addCmd
    EXPECT_TRUE(addCmd.called_with.empty());
}