import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import * as newsfeedService from './newsfeed.service.js';

export const getNewsfeedsByClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.userId;

    if (!classId) {
      throw new Error('classId is required');
    }

    const newsfeeds = await newsfeedService.getNewsfeedsByClass(parseInt(classId), teacherId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, newsfeeds, 'Lấy danh sách bài đăng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createNewsfeed = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { content, mediaUrl } = req.body;
    const teacherId = req.user.userId;

    if (!classId || !content) {
      throw new Error('classId và content là bắt buộc');
    }

    const newsfeed = await newsfeedService.createNewsfeed(
      parseInt(classId),
      teacherId,
      content,
      mediaUrl
    );
    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, newsfeed, 'Tạo bài đăng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteNewsfeed = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const teacherId = req.user.userId;

    await newsfeedService.deleteNewsfeed(parseInt(postId), teacherId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa bài đăng thành công')
    );
  } catch (error) {
    next(error);
  }
};
