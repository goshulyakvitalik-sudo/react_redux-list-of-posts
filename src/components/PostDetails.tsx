import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setCommentsLoading,
  setCommentsSuccess,
  setCommentsError,
  removeComment,
} from '../features/comments';
import { getPostComments, deleteComment } from '../api/comments';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

export const PostDetails: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector(state => state.selectedPost);
  const { loaded, hasError, items: comments } = useAppSelector(
    state => state.comments,
  );

  useEffect(() => {
    if (!selectedPost) {
      return;
    }

    setVisible(false);
    dispatch(setCommentsLoading());

    getPostComments(selectedPost.id)
      .then(commentsData => {
        dispatch(setCommentsSuccess(commentsData));
      })
      .catch(() => {
        dispatch(setCommentsError());
      });
  }, [selectedPost, dispatch]);

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId).then(() => {
      dispatch(removeComment(commentId));
    });
  };

  if (!selectedPost) {
    return null;
  }

  return (
    <div className="content">
      <h2 className="title is-4">
        {`#${selectedPost.id}: ${selectedPost.title}`}
      </h2>
      <p>{selectedPost.body}</p>

      <hr />

      <h3 className="title is-5">Comments:</h3>

      {!loaded && <Loader />}

      {loaded && hasError && (
        <div className="notification is-danger">
          Failed to load comments!
        </div>
      )}

      {loaded && !hasError && comments.length === 0 && (
        <p>No comments yet</p>
      )}

      {loaded && !hasError && comments.length > 0 && (
        <div className="block">
          {comments.map(comment => (
            <article key={comment.id} className="message is-small">
              <div className="message-header">
                <a href={`mailto:${comment.email}`}>{comment.name}</a>
                <button
                  type="button"
                  className="delete"
                  aria-label="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                />
              </div>
              <div className="message-body">{comment.body}</div>
            </article>
          ))}
        </div>
      )}

      {!visible && (
        <button
          type="button"
          className="button is-link"
          onClick={() => setVisible(true)}
        >
          Write a comment
        </button>
      )}

      {visible && (
        <NewCommentForm
          postId={selectedPost.id}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
};
