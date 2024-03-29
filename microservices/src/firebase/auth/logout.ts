import { getAuth, signOut } from "firebase/auth";
import { app } from '../config';

const auth = getAuth(app);
export default async function logout() {
   await signOut(auth).then(() => {
       console.log('User signed out');
      }).catch((error) => {
        console.log(error);
      });
}
