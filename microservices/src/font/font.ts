import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700', '800', '900']
  });


export default poppins;