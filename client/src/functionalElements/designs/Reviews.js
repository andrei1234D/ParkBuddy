import React from 'react';
import { useContext } from 'react';
import GlobalStatesContext from '../../context/GlobalStatesContext';
import studentReview from '../../images/reviewPhotos/studentReview.png';
import '../../style/Home.css';
function Reviews() {
  const { translate } = useContext(GlobalStatesContext);

  return (
    <div>
      <div className="informationContainer">
        <div className="cardReviewContainer">
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
          <div class="cardReview">
            <img
              src={studentReview}
              alt="studentPhoto"
              className="imgReview fadeAppear"
            ></img>

            <hr className="hrReviews fadeAppear"></hr>
            <div className="textReviews fadeAppear">
              As a student, Park Buddy made parking a breeze! Its user-friendly
              interface and helpful features improved significantly my campus
              routine. Highly recommended!
            </div>
            <div className="rating fadeAppear">
              <div className="stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="rating-text">5/5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
