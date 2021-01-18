import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_actions";

export default (SpecificComponent, option, adminRoute = null) => {

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
     // Dispatch fonctionne à chaque fois que la page est déplacée, envoyant des requêtes au backend en continu
      dispatch(auth()).then((response) => {
        // // pas connecté
        if (!response.payload.isAuth) {
          // Si vous n'êtes pas connecté et essayez d'entrer une page que seules les personnes connectées peuvent entrer
          // Envoyer à la page de connexion.
          if (option) {
            props.history.push("/login");
          }
        } else {
          // connecté
          // Si vous n'êtes pas un administrateur mais essayez d'accéder à la page réservée aux administrateurs
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            // Si vous vous connectez mais essayez d'entrer une page (connexion, etc.) que la personne connectée ne peut pas entrer
            if (option === false) props.history.push("/");
          }
        }
      });
    }, [dispatch, props.history]);

    return <SpecificComponent {...props} />;
  }

  return AuthenticationCheck;
};
