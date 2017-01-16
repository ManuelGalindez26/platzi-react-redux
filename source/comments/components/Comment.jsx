import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import styles from './Comment.css';

function Comment(props) {
  return (
    <article id={`comment-${props.id}`} className={styles.comment}>
      <div className={styles.meta}>
        <FormattedHTMLMessage
          id="comment.meta.author"
          values={{
            email: props.email,
            name: props.name,
          }}
        />
      </div>
      <p className={styles.body}>
        {props.body}
      </p>

    </article>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  body: PropTypes.string,
  email: PropTypes.string,
};

export default Comment;
