import React, { useEffect, useState, useContext } from "react";

import { SigninForm } from "../../components/SigninForm/SigninForm";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

//TODO
export const AuthPage = (): any => {
  return (
    <div>
      <SigninForm />
      <RegisterForm />
    </div>
  );
};
