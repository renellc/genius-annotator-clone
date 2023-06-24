import { Link } from "react-router-dom";

export const Home = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <h1>Genius Annotator Clone</h1>

    <div className="flex gap-x-5">
      <Link to="/create">Create</Link>
      <Link to="/my-annotations">My Annotations</Link>
    </div>
  </div>
);
