import httpStatus from 'http-status';
import * as studentService from './student.service.js';
import ApiResponse from '../../utils/ApiResponse.js';

export const getAllStudents = async (req, res) => {
  const data = await studentService.getAllStudents();
  res.status(httpStatus.OK).send(
    new ApiResponse(httpStatus.OK, data, 'Fetch all students successfully')
  );
};
