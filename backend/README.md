# FastAPI Project Template

This repository contains a ready-to-use FastAPI project template. It is intended to be used with the `fastapi_project_initializer` library to clone this template, create a virtual environment, and install dependencies automatically.

```
By
    ***   ***   ******   ******   ***********   ***********   **********   ***  ***
    ***  **     ******   ******   ***********   ***     ***   **********   ***  ***
    ******      *** *** *** ***   ***     ***   ***     ***   ***    ***   ***  ***
    ******      ***   ***   ***   ***********   *********     ***    ***   ***  ***
    ***  **     ***    *    ***   ***     ***   ***     **    **********    **  **
    ***   ***   ***         ***   ***     ***   ***     ***   **********     ****
```

## Contents

- **main.py**: The main file for the FastAPI application.
- **requirements.txt**: List of necessary dependencies for the project.
- **.gitignore**: File to ignore certain files/folders in the git repository.
- **Dockerfile**: File to build fastapi docker image
- **/app**: Folder with other important files of the API.
- **README.md**: This file.

## Manual Installation

If you want to clone and set up this project manually, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/kmarov17/fastapi_default_structure.git
    cd fastapi_default_structure
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:

    - On Windows:
        ```bash
        venv\Scripts\activate
        ```

    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Run the application:
    ```bash
    python main.py
    ```

## Using with `fastapi_project_initializer`

To initialize this project automatically using the `fastapi_project_initializer` library, follow these instructions:

1. Install the `fastapi_project_initializer` library:
    ```bash
    pip install fastapi_project_initializer
    ```

2. Use the `fastapi-init` command to initialize a new project:
    ```bash
    fastapi-init project_name
    ```

This will do the following:
- Clone this repository into a directory named `project_name`.
- Create and activate a virtual environment.
- Install the dependencies listed in `requirements.txt`.

## Project Structure

Here is a brief description of the main files and folders in this project template:

```
my_fastapi_project/
│
├── app/
│   ├── configs/           # Application configuration files
│   ├── models/            # Data model files
│   ├── routes/            # Routing (routes) files
│   ├── services/          # Application service files
│   |── utils/             # Utilities and tools
|   └──tests/              # Unit test files for the application
├── main.py                # Main application entry point
├── requirements.txt       # File listing the Python dependencies
├── .gitignore             # File to ignore specific files/folders in git
├── Dockerfile             # File to build fastapi docker image
└── README.md              # Project documentation
```


## Contributing

Contributions are welcome! If you would like to improve this project, please follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push the branch (`git push origin feature/my-new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
