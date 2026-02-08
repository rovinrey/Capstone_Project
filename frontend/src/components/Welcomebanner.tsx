interface WelcomeBannerProps {
  text: string;
}

const WelcomeBanner = ({ text }: WelcomeBannerProps) => {
  return (
    <div className="bg-blue-700 p-6 rounded-xl text-white shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold">{text}</h2>
      <p className="text-blue-100 mt-1">Pwede mo ako balik-balikan.</p>
    </div>  
  );
};

export default WelcomeBanner;