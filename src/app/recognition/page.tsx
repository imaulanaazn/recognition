import FaceRecognizer from "../components/recognition/FaceRecognizer";

const UserRecognition: React.FC = () => {
  return (
    <div className="w-full p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
      <FaceRecognizer />
      {/* <RecognitionHistory /> */}
    </div>
  );
};

export default UserRecognition;
