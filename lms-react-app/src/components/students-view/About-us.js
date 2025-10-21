import React from 'react';
import aboutUs from '../../assets/images/bg/pexels-divinetechygirl-1181329.jpg'

const AboutUs = () => {
    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            padding: '40px',
            backgroundColor: '#f4f4f4',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '100%',
            margin: '20px auto',
        },
        image: {
            flex: '1',
            borderRadius: '8px',
            marginRight: '50px',
            width: '250px', // Adjust width as needed
            height: 'auto',
        },
        textContainer: {
            flex: '1',
            textAlign: 'left',
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
        },
        description: {
            fontSize: '16px',
            color: '#555',
        },
    };

    return (
        <div style={styles.container}>
            <img
                src={aboutUs} // Replace with your image URL
                alt="About Us"
                style={styles.image}
            />
            <div style={styles.textContainer}>
                <h2 style={styles.title}>About Us</h2>
                <p style={styles.description}>
                    We are passionate about providing quality education and empowering individuals to reach their full potential. Our dedicated team works tirelessly to create innovative learning experiences for everyone. <br/>
                </p>
                <p style={styles.description}>
                    As a forward-thinking technology company, we specialize in creating innovative solutions that drive success. Our team of experts is passionate about leveraging technology to solve complex problems and enhance productivity. We believe in collaboration, creativity, and continuous improvement, and we're dedicated to providing exceptional service to our clients. Together, we can build a brighter digital future.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
