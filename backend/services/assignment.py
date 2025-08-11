from fastapi import HTTPException, UploadFile, File
from pydantic import BaseModel
import uuid
import os

# Define constants
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

# Define the Assignment model
class Assignment(BaseModel):
    id: str
    student_name: str
    subject: str
    description: str
    filename: str

class AssignmentCreate:
    @staticmethod
    async def submit_assignment(students, assignments, name, subject, description, file):
        # Check if student is registered
        if not any(s["name"] == name for s in students):
            raise HTTPException(status_code=404, detail="Student not registered")

        # Generate unique assignment ID
        assignment_id = str(uuid.uuid4())

        # Check if the file is empty
        if file.filename == "":
            raise HTTPException(status_code=400, detail="File is empty")

        # Check if the file size exceeds the limit
        await file.seek(0, os.SEEK_END)
        file_size = await file.tell()
        await file.seek(0)  # Reset the file pointer
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 20 MB")

        # Create unique filename
        filename = f"{name}-{uuid.uuid4()}-{file.filename}"
        file_path = f"assignments/{filename}"
        os.makedirs("assignments", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Create and store the assignment data
        assignment_data = Assignment(
            id=assignment_id,
            student_name=name,
            subject=subject,
            description=description,
            filename=filename,
        )
        assignments[assignment_id] = assignment_data

        #return {"Message": "Assignment submitted successfully"}

    assignment_service = AssignmentCreate()