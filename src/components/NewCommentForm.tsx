import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addComment } from '../features/comments';
import { createComment } from '../api/comments';

type Props = {
  postId: number;
  onClose: () => void;
};

export const NewCommentForm: React.FC<Props> = ({ postId, onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setName('');
    setEmail('');
    setBody('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !body.trim()) {
      return;
    }

    setLoading(true);

    createComment({
      postId,
      name,
      email,
      body,
    })
      .then(newComment => {
        dispatch(addComment(newComment));
        handleClear();
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="block">
      <div className="field">
        <label className="label">Author Name</label>
        <div className="control has-icons-left">
          <input
            type="text"
            className="input"
            placeholder="Name Surname"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <span className="icon is-left">
            <i className="fas fa-user" />
          </span>
        </div>
      </div>

      <div className="field">
        <label className="label">Author Email</label>
        <div className="control has-icons-left">
          <input
            type="email"
            className="input"
            placeholder="email@test.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <span className="icon is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>
      </div>

      <div className="field">
        <label className="label">Comment Text</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Type comment here"
            value={body}
            onChange={e => setBody(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-link ${loading ? 'is-loading' : ''}`}
            disabled={loading}
          >
            Add
          </button>
        </div>
        <div className="control">
          <button
            type="button"
            className="button is-link is-light"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
