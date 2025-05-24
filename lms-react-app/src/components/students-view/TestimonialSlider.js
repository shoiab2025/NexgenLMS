import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    text: "The course was incredibly thorough, and the instructors really know their stuff. I went from a complete beginner to building my own apps in just a few months. The mentorship and real-world projects were game-changers!",
    name: "Sarah Thompson",
    title: "Junior Web Developer",
  },
  {
    id: 2,
    text: "I had tried learning to code on my own with various free resources, but nothing stuck until I joined this program. The structure, support, and community made all the difference. I'm now confident in my programming skills and landed my first developer role!",
    name: "Mark Evans",
    title: "Software Engineer",
  },
  {
    id: 3,
    text: "The hands-on approach and personalized feedback made a huge impact on my learning journey. The instructors were patient and always available to help. I can't recommend this company enough for anyone serious about learning to code.",
    name: "Emily Martinez",
    title: "Front-End Developer",
  },
  {
    id: 4,
    text: "This course was beyond my expectations. The blend of theory and practical applications was perfect, and the support from the mentors really helped me solidify my understanding. I am now working as a freelance developer, something I never thought possible!",
    name: "James Cooper",
    title: "Freelance Developer",
  },
  {
    id: 5,
    text: "Learning to code felt intimidating, but the step-by-step approach made it all manageable. The community and resources were fantastic. I now feel confident in using multiple programming languages and building full-stack applications.",
    name: "Olivia Reynolds",
    title: "Full-Stack Developer",
  },
  {
    id: 6,
    text: "The level of detail in the courses and the real-world projects made it feel like I was already working in the industry. Thanks to their job placement support, I was able to transition into a software development role within months of graduating.",
    name: "Daniel Scott",
    title: "Backend Developer",
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = testimonials.length; // Total number of testimonials

  // Automatically move to the next testimonial every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 3 : prevIndex - 3
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * 3); // Navigate to the start of the corresponding three testimonials
  };

  // Inline styles for slider
  const styles = {
    container: {
      width: '100%',
      margin: '0 auto',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f8f8f8',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
    },
    sliderWrapper: {
      display: 'flex',
      transition: 'transform 0.5s ease-in-out',
      transform: `translateX(-${(currentIndex / 3) * 100}%)`, // Shift the visible testimonials
    },
    testimonial: {
      flex: '0 0 33.33%', // Each testimonial takes one-third of the slider width
      padding: '20px',
      boxSizing: 'border-box',
      fontSize: '18px',
      color: '#333',
    },
    name: {
      margin: '10px 0',
      fontSize: '22px',
      color: '#000',
    },
    title: {
      fontSize: '16px',
      color: '#777',
    },
    arrow: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '30px',
      color: '#007bff',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0 15px',
      zIndex: 1,
    },
    leftArrow: {
      left: '0',
    },
    rightArrow: {
      right: '0',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    dot: {
      height: '10px',
      width: '10px',
      margin: '0 5px',
      backgroundColor: '#ccc',
      borderRadius: '50%',
      display: 'inline-block',
      cursor: 'pointer',
    },
    activeDot: {
      backgroundColor: '#007bff', // Active dot color
    },
  };

  // Determine how many pages are needed based on the number of testimonials
  const numberOfPages = Math.ceil(totalSlides / 3);

  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.arrow, ...styles.leftArrow }}
        onClick={prevSlide}
      >
        ←
      </button>

      {/* Slider Container */}
      <div style={styles.sliderWrapper}>
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} style={styles.testimonial}>
            <p>"{testimonial.text}"</p>
            <h4 style={styles.name}>{testimonial.name}</h4>
            <span style={styles.title}>{testimonial.title}</span>
          </div>
        ))}
      </div>

      <button
        style={{ ...styles.arrow, ...styles.rightArrow }}
        onClick={nextSlide}
      >
        →
      </button>

      {/* Pagination Dots */}
      <div style={styles.pagination}>
        {Array.from({ length: numberOfPages }, (_, index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              ...(Math.floor(currentIndex / 3) === index ? styles.activeDot : {}),
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
