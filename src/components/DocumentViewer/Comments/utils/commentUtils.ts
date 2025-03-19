
import { Comment } from '../types';

/**
 * Organizes comments into threads by filtering root comments
 * and child comments
 */
export const organizeCommentThreads = (comments: Comment[]) => {
  // Root comments are those without a parent_id
  const rootComments = comments.filter(comment => !comment.parent_id);

  return rootComments;
};
