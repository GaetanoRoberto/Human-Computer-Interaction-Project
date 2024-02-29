import React from 'react';

const UserContext = React.createContext();
const ErrorContext = React.createContext();
const DirtyContext = React.createContext();
const setDirtyContext = React.createContext();

export { UserContext,ErrorContext,DirtyContext,setDirtyContext };