import React, { useEffect } from 'react';
import { getUsers } from './api/users';
import { getUserPosts } from './api/posts';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUsers } from './features/users';
import {
  setPostsLoading,
  setPostsSuccess,
  setPostsError,
} from './features/posts';
import { setSelectedPost } from './features/selectedPost';
import { UserSelector } from './components/UserSelector';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const author = useAppSelector(state => state.author);
  const selectedPost = useAppSelector(state => state.selectedPost);

  useEffect(() => {
    getUsers().then(usersData => {
      dispatch(setUsers(usersData));
    });
  }, [dispatch]);

  useEffect(() => {
    if (!author) {
      dispatch(setPostsSuccess([]));
      dispatch(setSelectedPost(null));

      return;
    }

    dispatch(setSelectedPost(null));
    dispatch(setPostsLoading());

    getUserPosts(author.id)
      .then(postsData => {
        dispatch(setPostsSuccess(postsData));
      })
      .catch(() => {
        dispatch(setPostsError());
      });
  }, [author, dispatch]);

  return (
    <div className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-7">
            <div className="box">
              <UserSelector />
              <PostsList />
            </div>
          </div>

          <div className="column is-5">
            <div className="box">
              {selectedPost ? (
                <PostDetails />
              ) : (
                <p>Choose a post</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
