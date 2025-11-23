#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "Input.h"
#include "Output.h"
#include "ICommand.h"
#include "ICompress.h"
#include "App.h"

using ::testing::Return;
using ::testing::_;
using ::testing::Throw;
using ::testing::InSequence;
using ::testing::StrictMock;

// Mock Input class
class MockInput : public Input {
public:
    MOCK_METHOD(std::string, read, (), (override));
};

// Mock Output class
class MockOutput : public Output {
public:
    MockOutput() : Output(std::cout) {} // call base constructor
    MOCK_METHOD(void, write, (std::string output), (override));
};

// Mock Compress class
class MockCompress : public ICompress {
public:
    MOCK_METHOD(std::string, compress, (const std::string& raw_data), (override));
    MOCK_METHOD(std::string, decompress, (const std::string& compressed_data), (override));
};

// Mock Command class
class MockCommand : public ICommand {
public:
    MOCK_METHOD(void, execute, (const std::string& file_info, ICompress* compressor, Output* output), (override));
};

// TEST: should call the correct command according to Input class
TEST(AppTest, CallsCorrectCommand) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockCommand> getCmd;
    StrictMock<MockCommand> searchCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    InSequence seq;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add file1 hello"))
        .WillOnce(Return("get file1"))
        .WillOnce(Return("search abc"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute("file1 hello", &compress, &output));
    EXPECT_CALL(getCmd, execute("file1", &compress, &output));
    EXPECT_CALL(searchCmd, execute("abc", &compress, &output));

    App app(&input, &output, &compress, {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
    });

    app.run();
}

// TEST: should display error when command throws exception
TEST(AppTest, DisplaysErrorOnException) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add badFile oops"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute("badFile oops", &compress, &output))
        .WillOnce(Throw(MyException()));

    App app(&input, &output, &compress, {
        {"add", &addCmd}
    });

    app.run();
}

// TEST: should handle invalid command id
TEST(AppTest, HandlesInvalidCommandId) {
    StrictMock<MockInput> input;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("unknown something"))
        .WillOnce(Return("exit"));

    App app(&input, &output, &compress, {});

    app.run();
}

// TEST: should loop and execute multiple commands
TEST(AppTest, LoopsAndExecutesMultipleCommands) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;
    StrictMock<MockCommand> getCmd;
    StrictMock<MockCommand> searchCmd;

    InSequence seq;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add f1 a"))
        .WillOnce(Return("get f2"))
        .WillOnce(Return("search bcd"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute("f1 a", &compress, &output));
    EXPECT_CALL(getCmd, execute("f2", &compress, &output));
    EXPECT_CALL(searchCmd, execute("bcd", &compress, &output));

    App app(&input, &output, &compress, {
        {"add", &addCmd},
        {"get", &getCmd},
        {"search", &searchCmd}
    });

    app.run();
}

// TEST: should inject and use Input + commands correctly
TEST(AppTest, InjectsAndUsesDependencies) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockCommand> searchCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add fileY data"))
        .WillOnce(Return("search keyword"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute("fileY data", &compress, &output));
    EXPECT_CALL(searchCmd, execute("keyword", &compress, &output));

    App app(&input, &output, &compress, {
        {"add", &addCmd},
        {"search", &searchCmd}
    });

    app.run();
}

// -----------------------------
// EDGE CASE TESTS
// -----------------------------

// Empty input 
TEST(AppTest, HandlesEmptyInput) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return(""))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute(_, _, _)).Times(0);

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();
}

// Command without content
TEST(AppTest, CommandWithoutContent) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add "))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute(_, _, _)).Times(0);

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();
}

// Leading/trailing spaces
TEST(AppTest, CommandWithExtraSpaces) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add   file1   content   "))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute("file1 content", &compress, &output));

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();
}

// Unknown command
TEST(AppTest, UnknownCommand) {
    StrictMock<MockInput> input;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("delete file1"))
        .WillOnce(Return("exit"));

    App app(&input, &output, &compress, {});
    app.run();
}

// Command throws custom exception
class MyException : public std::exception {};
TEST(AppTest, CommandThrowsCustomException) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add fileX data"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute(_, _, _))
        .WillOnce(Throw(MyException()));

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();
}

// Mixed sequence of commands
TEST(AppTest, MixedSequenceOfCommands) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockCommand> searchCmd;
    StrictMock<MockCommand> getCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add f1 a"))
        .WillOnce(Return("search a"))
        .WillOnce(Return("get f1"))
        .WillOnce(Return("add file 1 invalid")) // invalid → ignored
        .WillOnce(Return("unknown"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute("f1 a", &compress, &output));
    EXPECT_CALL(searchCmd, execute("a", &compress, &output));
    EXPECT_CALL(getCmd, execute("f1", &compress, &output));

    App app(&input, &output, &compress, {
        {"add", &addCmd},
        {"search", &searchCmd},
        {"get", &getCmd}
    });

    app.run();
}

// invalid file name → contains space
TEST(AppTest, CommandWithInvalidFileName) {
    StrictMock<MockInput> input;
    StrictMock<MockCommand> addCmd;
    StrictMock<MockOutput> output;
    StrictMock<MockCompress> compress;

    EXPECT_CALL(input, read())
        .WillOnce(Return("add file 1 content"))
        .WillOnce(Return("exit"));

    EXPECT_CALL(addCmd, execute(_, _, _)).Times(0); 
    EXPECT_CALL(output, write(_)).Times(0); 

    App app(&input, &output, &compress, {{"add", &addCmd}});
    app.run();
}
