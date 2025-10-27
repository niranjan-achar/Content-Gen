#!/usr/bin/env python3
"""
ContentGen Project Startup Script
Automatically starts both backend and frontend servers with dependency checks
"""

import os
import platform
import subprocess
import sys
import time
from pathlib import Path
from typing import Optional, Tuple


# ANSI color codes for Windows/Unix
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    WHITE = '\033[97m'
    GRAY = '\033[90m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str, color: str = Colors.CYAN):
    """Print formatted header"""
    print(f"\n{color}{'=' * 60}{Colors.RESET}")
    print(f"{color}{text.center(60)}{Colors.RESET}")
    print(f"{color}{'=' * 60}{Colors.RESET}\n")

def print_step(step: str, total: int, current: int, text: str):
    """Print step information"""
    print(f"{Colors.YELLOW}[{current}/{total}] {step}{Colors.RESET}")
    print(f"{Colors.GRAY}      {text}{Colors.RESET}")

def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")

def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")

def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.RESET}")

def check_command_exists(command: str) -> bool:
    """Check if a command exists in PATH"""
    try:
        # On Windows, we need to use shell=True for .cmd files
        result = subprocess.run(
            f"{command} --version",
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            shell=True,
            check=False
        )
        return result.returncode == 0
    except (FileNotFoundError, OSError):
        return False

def check_python_version() -> Tuple[bool, str]:
    """Check if Python version is 3.8+"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        return True, f"{version.major}.{version.minor}.{version.micro}"
    return False, f"{version.major}.{version.minor}.{version.micro}"

def check_node_installed() -> bool:
    """Check if Node.js is installed"""
    return check_command_exists("node")

def check_npm_installed() -> bool:
    """Check if npm is installed"""
    return check_command_exists("npm")

def check_poetry_installed() -> bool:
    """Check if Poetry is installed"""
    return check_command_exists("poetry")

def install_backend_dependencies(backend_path: Path) -> bool:
    """Install backend dependencies using Poetry"""
    print_step("Installing Backend Dependencies", 6, 3, "Running poetry install...")
    try:
        result = subprocess.run(
            ["poetry", "install"],
            cwd=backend_path,
            check=True,
            capture_output=True,
            text=True
        )
        print_success("Backend dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install backend dependencies: {e}")
        print(e.stderr)
        return False

def install_frontend_dependencies(frontend_path: Path) -> bool:
    """Install frontend dependencies using npm"""
    print_step("Installing Frontend Dependencies", 6, 4, "Running npm install...")
    try:
        result = subprocess.run(
            ["npm", "install"],
            cwd=frontend_path,
            check=True,
            capture_output=True,
            text=True
        )
        print_success("Frontend dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install frontend dependencies: {e}")
        print(e.stderr)
        return False

def check_env_file(backend_path: Path) -> bool:
    """Check if .env file exists in backend"""
    env_file = backend_path / ".env"
    env_example = backend_path / ".env.example"
    
    if env_file.exists():
        print_success(".env file found")
        return True
    elif env_example.exists():
        print_warning(".env file not found, but .env.example exists")
        print(f"{Colors.YELLOW}      Please copy .env.example to .env and configure it{Colors.RESET}")
        return False
    else:
        print_warning(".env file not found")
        return False

def start_backend(backend_path: Path) -> Optional[subprocess.Popen]:
    """Start the backend server"""
    print_step("Starting Backend Server", 6, 5, "Starting FastAPI with uvicorn...")
    
    is_windows = platform.system() == "Windows"
    
    try:
        if is_windows:
            # Windows: Use START command to open new window
            process = subprocess.Popen(
                ["powershell", "-Command", 
                 f"cd '{backend_path}'; "
                 "Write-Host 'Backend Server Starting...' -ForegroundColor Green; "
                 "poetry run uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            # Unix-like: Use gnome-terminal or xterm
            process = subprocess.Popen(
                ["poetry", "run", "uvicorn", "backend.main:app", 
                 "--host", "127.0.0.1", "--port", "8000", "--reload"],
                cwd=backend_path
            )
        
        print_success(f"Backend server started (PID: {process.pid})")
        return process
    except Exception as e:
        print_error(f"Failed to start backend: {e}")
        return None

def start_frontend(frontend_path: Path) -> Optional[subprocess.Popen]:
    """Start the frontend server"""
    print_step("Starting Frontend Server", 6, 6, "Starting Vite dev server...")
    
    is_windows = platform.system() == "Windows"
    
    try:
        if is_windows:
            # Windows: Use START command to open new window
            process = subprocess.Popen(
                ["powershell", "-Command", 
                 f"cd '{frontend_path}'; "
                 "Write-Host 'Frontend Server Starting...' -ForegroundColor Green; "
                 "npm run dev"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            # Unix-like: Use gnome-terminal or xterm
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=frontend_path
            )
        
        print_success(f"Frontend server started (PID: {process.pid})")
        return process
    except Exception as e:
        print_error(f"Failed to start frontend: {e}")
        return None

def main():
    """Main startup function"""
    # Get project root directory
    project_root = Path(__file__).parent.absolute()
    backend_path = project_root / "backend"
    frontend_path = project_root / "frontend"
    
    # Print header
    print_header("Starting ContentGen Application")
    
    # Step 1: Check Python version
    print_step("Checking Python Version", 6, 1, "Verifying Python 3.8+...")
    is_valid, version = check_python_version()
    if is_valid:
        print_success(f"Python {version} found")
    else:
        print_error(f"Python {version} is too old. Please upgrade to Python 3.8+")
        sys.exit(1)
    
    # Step 2: Check required tools
    print_step("Checking Required Tools", 6, 2, "Verifying Node.js, npm, and Poetry...")
    
    tools_ok = True
    
    if not check_node_installed():
        print_error("Node.js is not installed")
        print(f"{Colors.YELLOW}      Download from: https://nodejs.org/{Colors.RESET}")
        tools_ok = False
    else:
        print_success("Node.js found")
    
    if not check_npm_installed():
        print_error("npm is not installed")
        tools_ok = False
    else:
        print_success("npm found")
    
    if not check_poetry_installed():
        print_error("Poetry is not installed")
        print(f"{Colors.YELLOW}      Install with: pip install poetry{Colors.RESET}")
        tools_ok = False
    else:
        print_success("Poetry found")
    
    if not tools_ok:
        print_error("\nPlease install missing tools and try again")
        sys.exit(1)
    
    # Check .env file
    check_env_file(backend_path)
    
    # Step 3: Install backend dependencies
    if not (backend_path / "poetry.lock").exists():
        print_warning("Backend dependencies not installed")
        if not install_backend_dependencies(backend_path):
            print_error("Failed to install backend dependencies")
            sys.exit(1)
    else:
        print_success("Backend dependencies already installed")
    
    # Step 4: Install frontend dependencies
    if not (frontend_path / "node_modules").exists():
        print_warning("Frontend dependencies not installed")
        if not install_frontend_dependencies(frontend_path):
            print_error("Failed to install frontend dependencies")
            sys.exit(1)
    else:
        print_success("Frontend dependencies already installed")
    
    # Step 5: Start backend
    backend_process = start_backend(backend_path)
    if not backend_process:
        print_error("Failed to start backend server")
        sys.exit(1)
    
    # Wait for backend to initialize
    print(f"{Colors.GRAY}      Waiting for backend to initialize...{Colors.RESET}")
    time.sleep(4)
    
    # Step 6: Start frontend
    frontend_process = start_frontend(frontend_path)
    if not frontend_process:
        print_error("Failed to start frontend server")
        # Clean up backend process
        backend_process.terminate()
        sys.exit(1)
    
    # Print success message
    print_header("ContentGen is Running!", Colors.GREEN)
    print(f"{Colors.BOLD}{Colors.WHITE}   Backend:  http://127.0.0.1:8000/docs{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.WHITE}   Frontend: http://localhost:5173{Colors.RESET}")
    print(f"\n{Colors.CYAN}Both servers are running in separate windows.{Colors.RESET}")
    print(f"{Colors.CYAN}Close those windows or press Ctrl+C here to stop.{Colors.RESET}\n")
    
    # Keep the script running
    try:
        while True:
            time.sleep(1)
            # Check if processes are still running
            if backend_process.poll() is not None:
                print_error("Backend server stopped unexpectedly")
                if frontend_process.poll() is None:
                    frontend_process.terminate()
                break
            if frontend_process.poll() is not None:
                print_error("Frontend server stopped unexpectedly")
                if backend_process.poll() is None:
                    backend_process.terminate()
                break
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Shutting down servers...{Colors.RESET}")
        if backend_process.poll() is None:
            backend_process.terminate()
            print_success("Backend server stopped")
        if frontend_process.poll() is None:
            frontend_process.terminate()
            print_success("Frontend server stopped")
        print(f"{Colors.GREEN}ContentGen stopped successfully{Colors.RESET}\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_error(f"An error occurred: {e}")
        sys.exit(1)
