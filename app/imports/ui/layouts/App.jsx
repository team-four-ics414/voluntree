import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import ListStuff from '../pages/ListStuff';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddStuff from '../pages/AddStuff';
import EditStuff from '../pages/EditStuff';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import FAQ from '../pages/FAQ';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import AddNonprofit from '../pages/AddNonprofit';
import EditNonprofit from '../pages/EditNonprofit';
import ListNonprofit from '../pages/ListNonprofit';
import ListNonprofitAdmin from '../pages/ListNonprofitAdmin';
import NotAuthorized from '../pages/NotAuthorized';
import { ROLE } from '../../api/role/Role';
import LoadingSpinner from '../components/LoadingSpinner';
import ManageDatabase from '../pages/ManageDatabase';
import AddOrganization from '../pages/AddOrganization';
import AddActivity from '../pages/AddActivity';
import SideChat from '../components/SideChat';
import ListOpportunities from '../pages/ListOpportunities';
import ViewNonprofit from '../pages/ViewNonprofit';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <div className="flex-grow-1">
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signout" element={<SignOut />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/opportunities" element={<ListOpportunities />} />
            <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
            <Route path="/list" element={<ProtectedRoute><ListStuff /></ProtectedRoute>} />
            <Route path="/nonprofits" element={<ProtectedRoute ready={ready}><ListNonprofit /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddStuff /></ProtectedRoute>} />
            <Route path="/add-nonprofit" element={<ProtectedRoute><AddNonprofit /></ProtectedRoute>} />
            <Route path="/view-nonprofit/:_id" element={<ProtectedRoute><ViewNonprofit /></ProtectedRoute>} />
            <Route path="/edit/:_id" element={<ProtectedRoute><EditStuff /></ProtectedRoute>} />
            <Route path="/addorganization" element={<ProtectedRoute><AddOrganization /></ProtectedRoute>} />
            <Route path="/addactivity" element={<ProtectedRoute><AddActivity /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><SideChat /></ProtectedRoute>} />
            <Route path="/edit-nonprofit/:_id" element={<ProtectedRoute><EditNonprofit /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminProtectedRoute ready={ready}><ListStuffAdmin /></AdminProtectedRoute>} />
            <Route path="/nonprofits-admin" element={<AdminProtectedRoute ready={ready}><ListNonprofitAdmin /></AdminProtectedRoute>} />
            <Route path="/manage-database" element={<AdminProtectedRoute ready={ready}><ManageDatabase /></AdminProtectedRoute>} />
            <Route path="/notauthorized" element={<NotAuthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  console.log('ProtectedRoute', isLogged);
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  console.log('AdminProtectedRoute', isLogged, isAdmin);
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
