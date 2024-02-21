import React from 'react';
import { Carousel, Image } from 'react-bootstrap';

const CardSlider = () => {
  const backgroundColor = 'rgba(13, 141, 120, 0.6)';
  const borderRadius = '10px';
  const textAlign = 'left';
  const padding = '10px';
  const carouselStyle = {
    width: '100%',
    height: '500px',
  };

  return (
    <Carousel>
      <Carousel.Item interval={6500} style={carouselStyle}>
        <Image src="/images/clean-up.jpeg" text="First slide" />
        <Carousel.Caption>
          <h3 style={{ backgroundColor, padding, borderRadius }}>Community Clean-Up Day</h3>
          <p style={{ backgroundColor, padding, borderRadius, textAlign }}>
            Volunteers gathered in the local community to pick up litter, clean parks, and beautify public spaces. Their efforts resulted
            in a cleaner and more attractive environment for residents and visitors alike.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={6500} style={carouselStyle}>
        <Image src="/images/fooddrive.jpg" text="Second slide" />
        <Carousel.Caption>
          <h3 style={{ backgroundColor, padding, borderRadius }}>Food Drive for the Homeless Shelter</h3>
          <p style={{ backgroundColor, padding, borderRadius, textAlign }}>
            Volunteers organized a food drive to collect non-perishable items for a local homeless shelter. Through their efforts, they
            were able to gather a significant amount of food and essential supplies, providing much-needed support to individuals
            experiencing homelessness.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={6500} style={carouselStyle}>
        <Image src="/images/tutoring.jpeg" text="Third slide" />
        <Carousel.Caption>
          <h3 style={{ backgroundColor, padding, borderRadius }}>Tutoring and Mentoring Program</h3>
          <p style={{ backgroundColor, padding, borderRadius, textAlign }}>
            Volunteers volunteered as tutors and mentors for children from underprivileged backgrounds, providing academic support and
            guidance. Through one-on-one tutoring sessions and mentoring relationships, volunteers helped students improve their academic
            performance, build confidence, and develop important life skills.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={6500} style={carouselStyle}>
        <Image src="/images/conservation.jpeg" text="Fourth slide" />
        <Carousel.Caption>
          <h3 style={{ backgroundColor, padding, borderRadius }}>Environmental Conservation Project</h3>
          <p style={{ backgroundColor, padding, borderRadius, textAlign }}>
            Volunteers participated in an environmental conservation project, planting trees, restoring habitats, and removing invasive
            species. Their efforts helped to preserve and protect natural ecosystems, promoting biodiversity and mitigating the effects
            of climate change. By volunteering their time and energy, participants contributed to the long-term health and sustainability
            of the environment.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CardSlider;
