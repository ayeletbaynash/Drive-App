# Authentication & Access Flow

The gateway to **AweSoMe Drive** is designed to be streamlined and secure. Whether you are accessing the system through our **React Web Client** or the **React Native Mobile App**, the authentication process ensures your data remains private and accessible only to you.

---

## Initial Entry: The Login Screen

Upon launching the application via Docker Compose, all users are directed to the **Login Screen**. 

* **Existing Users:** Enter your unique **Username** and **Password** to access your files.
* **New Users:** If you don't have an account, click the **"Register here"** link located below the login button to navigate to the Registration screen.

<img width="248.0625" height="537.6" alt="image" src="https://github.com/user-attachments/assets/81f982b4-1383-4808-a37b-7b9bf0b5165e" /> <img width="720" height="402.3" alt="image" src="https://github.com/user-attachments/assets/9e14e94d-2990-4889-9214-a670d6f1fa26" />

---

## User Registration (Sign Up)

For new users, the registration form requires specific details to create a secure account. Our system implements real-time validation to ensure all security protocols are met before an account is created.

### Required Fields & Validation
| Field | Validation Requirement |
| :--- | :--- |
| **Full Name** | Must be provided. |
| **Username** | Must be unique. |
| **Email** | Must follow a valid email structure (includes `@` and `.`). |
| **Password** | Minimum **8 characters**, containing at least **one number**, **one uppercase** and **one lowercase** letter. |
| **Confirm Password** | Must be an exact match to the password field. |
| **Profile Picture** | **Web:** Select from local computer files. <br> **Mobile:** Upload from **Gallery** or take a photo using the **Camera**. |

#

<img width="248.0625" height="537.6" alt="image" src="https://github.com/user-attachments/assets/c98bfd20-3a35-4249-863b-c08279d79fb7" /> <img width="720" height="402.3" alt="image" src="https://github.com/user-attachments/assets/1489a333-e25e-48af-a977-f4bc558be748" />

---

###  Handling Validation Errors
If the data entered does not meet the requirements, the system provides clear visual feedback to guide the user.

<img width="248.0625" height="537.6" alt="image" src="https://github.com/user-attachments/assets/04a80c34-3c7d-4e5d-a87f-566e9a0de1e0" />

---

### Navigation & Corrections
If you wish to exit the registration process or if you accidentally clicked "Register here," simply click the **Back Arrow button** (located at the top of the screen) to return to the Login page.

---

## Accessing Your Drive

Once your account is created, logging in is a quick and straightforward process. 

To enter your drive, simply provide the same **Username** and **Password** you used during the registration phase. The system is built for efficiency, taking you directly to your personal home screen as soon as you are authenticated.

While the user experience is simple, the system is working hard behind the scenes. Your login triggers a seamless connection between the frontend (React/React Native) and our multi-layered backend infrastructure (Node.js and C++), ensuring that your files are securely synchronized and ready for use the moment you arrive.

---

### The Home Screen (Your Drive)
Upon entering, you will see your personal drive immediately:
* If you have files or folders (including those shared with you), they will appear in the list.
* If you are a new user, you will see an empty state, ready for your first upload or folder creation.

---

## Native Experience Highlights

* **Web Integration:** Optimized for desktop browsers using React, featuring a traditional layout.
* **Mobile Flexibility:** Built with React Native and Expo, utilizing mobile-specific hardware for the camera and intuitive touch gestures.
