import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from '../components/calendar/Calendar';

const OrganizationLandingPage = ({ organization }) => {
  if (!organization) return <div>No organization selected.</div>;

  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const {
    name = 'N/A',
    type = 'Unknown Type',
    missionStatement = 'No mission statement provided.',
    description = 'No additional information available.',
    causes = [],
    contactEmail = 'No email provided',
    phoneNumber = 'No phone number available',
    website = '#',
    address = {},
    logo = '/images/nonprofit-handshake.jpg', // Ensure this default image exists
    joinButtonText = 'Join Us',
    mapUrl = 'https://www.google.com/maps?q=placeholder', // Default map URL
  } = organization;

  const { street = '', city = '', state = '', zipCode = '', country = '' } = address;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="bg-cover bg-center text-white py-20 px-4" style={{ backgroundImage: `url(${logo})` }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold uppercase">{name}</h1>
          <p className="mt-2 text-xl">{type}</p>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-md py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <nav className="flex space-x-4">
            <a href="#about" className="text-lg font-semibold hover:text-gray-600">About</a>
            <button onClick={toggleCalendar} className="text-lg font-semibold hover:text-gray-600">
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </nav>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {joinButtonText}
          </button>
        </div>
      </div>

      {/* Calendar Component */}
      {showCalendar && <Calendar />}

      {/* Main Content */}
      <div className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 md:flex md:items-start md:space-x-8">
          {/* Left Column */}
          <div className="md:w-2/3">
            <div id="about">
              <h2 className="text-3xl font-semibold text-gray-900">Mission Statement</h2>
              <p className="mt-4 text-lg text-gray-600">{missionStatement}</p>
              <h2 className="text-3xl font-semibold text-gray-900 mt-8">About</h2>
              <p className="mt-4 text-lg text-gray-600">{description}</p>
            </div>
            <div id="causes" className="mt-8">
              <h2 className="text-3xl font-semibold text-gray-900">Causes</h2>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {causes.length > 0 ? causes.map((cause, index) => (
                  <li key={index} className="text-lg text-gray-800">{cause}</li>
                )) : (
                  <li>No causes listed.</li>
                )}
              </ul>
            </div>
          </div>
          {/* Right Column */}
          <div className="md:w-1/3 mt-8 md:mt-0 bg-gray-50 p-4 rounded-lg shadow-lg">
            <div id="contact-info">
              <h2 className="text-3xl font-semibold text-gray-900">Contact Info</h2>
              <p className="mt-4">
                <strong>Email:</strong> {contactEmail}<br />
                <strong>Phone:</strong> {phoneNumber}<br />
                <strong>Website:</strong> <a href={website} className="text-blue-600 hover:underline">{website}</a><br />
                <strong>Address:</strong> {`${street}, ${city}, ${state} ${zipCode}, ${country}`}
              </p>
              <div className="mt-4">
                <iframe
                  title="Organization Location"
                  src={mapUrl}
                  width="100%"
                  height="300"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OrganizationLandingPage;
