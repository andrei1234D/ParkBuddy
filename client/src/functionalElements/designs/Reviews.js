import React, { useContext } from 'react';
import GlobalStatesContext from '../../context/GlobalStatesContext';
import reviews from './Arrays/reviews'; // Adjust path as per your project structure

import '../../style/Home.css';

function Reviews() {
  const { translate } = useContext(GlobalStatesContext);

  return (
    <div className="informationContainer">
      <p
        className="titleDiv fadeAppearTitle"
        style={{ margin: '20px 0 20px 0' }}
      >
        {translate('reviewsTitle').toUpperCase()}
      </p>
      <div className="cardReviewContainer">
        {reviews.map((review, index) => (
          <div className="cardReview fadeAppear" key={index}>
            <img src={review.imgSrc} alt="Review" className="imgReview" />
            <hr className="hrReviews" />
            <div className="textReviews">{translate(review.content)}</div>
            <div className="rating">
              <div className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="star">
                    &#9733;
                  </span>
                ))}
              </div>
              <div className="rating-text">{review.rating}/5</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
