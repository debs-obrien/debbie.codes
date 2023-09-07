---
title: Python and Playwright
date: 2023-09-07
description: For those new to Python here is a quick beginners guide on how to setup Python and Pytest and install Playwright. We then create an example test and run it in both headed and headless mode meaning with and without a browser window.
published: true
image: photo-1528158222524-d4d912d2e208?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80
provider: imgix
tags: [playwright, testing]
---

This is a quick guide on how to setup Python and Pytest and install Playwright and get your first test up and running. As a very new user to Python there were a couple of things I had to do to first get Python installed on the computer. This will depend of course on the operating system you are using. Check out the [Python website](https://www.python.org/downloads/) for more information on how to install Python.

Once Python has been installed on your computer you can check it has been properly installed by running the following command in your terminal:

```bash
python3 --version
```

## Manage multiple versions of Python

We then use `pyenv` which is a command line tool used to manage multiple versions of Python. This is useful if you are working on multiple projects that use different versions of Python. Check out the [GitHub readme](https://github.com/pyenv/pyenv) of the 'pyenv' project for more information on how to install it on your operating system. For windows check out [`pyenv-win`](https://github.com/pyenv-win/pyenv-win) or you can use `venv` Python's Built-in Virtual Environment.

Once `pyenv` has been installed we can use the following command to install a specific version of Python:

```bash
pyenv install 3.11
```
This command will download the course code for Python 3.11, compile it and set it up as one of the available versions of Python that you can use on your computer. We can then use the `pyenv shell` command to switch to and use the version of Python we just installed:

```bash
pyenv shell 3.11
```

In order to check you are using the correct version of Python you can run the following command:

```bash
python --version
```
## Create a virtual environment

Next we need to download a `virtualenv` package from the Python Package Index (PyPI). This is a tool used to create isolated Python environments. Virtual environments allow you to create a self-contained environment with its own set of Python libraries and dependencies and prevents conflicts between different project dependencies when working on multiple projects. The package installer for Python is called `pip`. In order to install our virtual environment we can run the following command:

```bash
pip install virtualenv
```

We can then create a new folder for our project and change directory so we are inside the folder. We can do this using the terminal with the following commands:

```bash
mkdir my-project
cd my-project
```

Now we need to create a virtual environment for our project. Inside the directory we have just created we will create an isolated environment with its own Python interpreter and a separate set of Python libraries and packages. `virtualenv` is the command used to create a virtual environment and we can specify the name of the virtual environment we want to create. In this case we will call it `env`:

```bash
virtualenv env
```

Once the virtual environment has been created we can activate it using the following command:

On MacOS and Linux:
```bash
source env/bin/activate
```
On Windows:
```bash
env\Scripts\activate
```

## Install Pytest and Playwright

Now that everything as been setup we can go ahead and start installing our `pytest-playwright` package, which is a plugin that integrates Playwright with the Pytest testing framework. The package installer for Python is called `pip` which is used to install packages from the Python Package Index (PyPI). We can install the `pytest-playwright` package using the following command which will also install `pytest` if you haven't installed it already.

```bash
pip install pytest-playwright
```

Next we need to use the command-line tool from Playwright to install the required browser binaries, which are stored locally and used by Playwright to launch and interact with the browsers. These can be installed with the following command:

```bash
playwright install
```

## Create a test

Now in our editor of choice we can create a new file called `test_example.py` and create an example test. In Python we need to always prefix our test file with the word `test`.

```python
import re
from playwright.sync_api import Page, expect

def test_has_title(page: Page):
    page.goto("https://playwright.dev/")

    # Expect a title "to contain" a substring.
    expect(page).to_have_title(re.compile("Playwright"))

def test_get_started_link(page: Page):
    page.goto("https://playwright.dev/")

    # create a locator
    get_started = page.get_by_role("link", name="Get started")

    # Expect an attribute "to be strictly equal" to the value.
    expect(get_started).to_have_attribute("href", "/docs/intro")

    # Click the get started link.
    get_started.click()
    
    # Expects page to have a heading with the name of Installation.
    expect(page.get_by_role("heading", name="Installation")).to_be_visible()
```
## Run our test with Playwright

We are now ready to run our test to see if it works. We can do this by running the following command in the terminal:

```bash
pytest
```

And right there in the terminal you can see we now have a passing test. We have successfully setup Python and Pytest and installed Playwright and got our first test up and running. However we did not visually see our test pass as by default Playwright runs in headless mode meaning without a browser window. We can change this by passing the `--headed` flag to our command:

```bash
pytest --headed
```

This time you will see a browser window pop up and the test will run so you can visually see it pass.

## Conclusion

In this post we learnt how to setup Python and install Playwright so we can easily write and run our Playwright tests in Python. Check out the [Playwright documentation](https://playwright.dev/python/docs/intro) for more information on writing, running and generating Playwright tests in Python.
