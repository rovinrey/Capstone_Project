interface BannerProps {
    text: string;
}
function WelcomeBanner({text}: BannerProps){
    return(
        <>
            <h2>{text}</h2>
        </>
    );
};
export default WelcomeBanner;