// import React from 'react';
// import PropTypes from 'prop-types';
//
// const ForumComments = ({ comment }) => (
//   <div style={{ backgroundColor: '#f0f2f5', padding: '10px 10px 5px 10px', borderRadius: '10px', marginBottom: '10px' }}>
//     <h6><b>{comment.owner}</b></h6>
//     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//       <p> |-- {comment.contents}</p>
//       {comment.lastUpdated ? (
//         <p>Updated {comment.lastUpdated.toDateString()}</p>
//       ) : (<p>Posted: {comment.createdAt.toDateString()}</p>)}
//     </div>
//   </div>
// );
//
// // Require a document to be passed to this component.
// ForumComments.propTypes = {
//   comment: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     postId: PropTypes.string.isRequired,
//     contents: PropTypes.string.isRequired,
//     owner: PropTypes.string.isRequired,
//     createdAt: PropTypes.instanceOf(Date),
//     lastUpdated: PropTypes.instanceOf(Date),
//   }).isRequired,
// };
//
// export default ForumComments;
