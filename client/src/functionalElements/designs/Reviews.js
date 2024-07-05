import React from 'react';
import { useContext } from 'react';

import reviews from './Arrays/reviews';

import GlobalStatesContext from '../../context/GlobalStatesContext';

import '../../style/Home.css';
function Reviews() {
  const { translate } = useContext(GlobalStatesContext);
  console.log(reviews);
  return (
    <div>
      <div className="informationContainer">
        <p
          className="titleDiv fadeAppearTitle"
          style={{ margin: '20px 0 20px 0' }}
        >
          REVIEWS
        </p>
        <div className="cardReviewContainer">
          {reviews.map((review, index) => (
            <div className="cardReview" key={index}>
              <img
                src={review.imgSrc}
                alt="studentPhoto"
                className="imgReview fadeAppear"
              />
              <hr className="hrReviews fadeAppear" />
              <div className="textReviews fadeAppear">{review.text}</div>
              <div className="rating fadeAppear">
                <div className="stars">
                  {[...Array(review.rating)].map((star, i) => (
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
    </div>
  );
}

export default Reviews;
