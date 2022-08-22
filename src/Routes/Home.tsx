import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import ReactPlayer from "react-player";
import {
  getMovies,
  getVideo,
  IGetMoviesResult,
  IGetVideosResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieSlider from "../Components/MovieSlider";
import Loader from "../Components/Loader";
import "../css/iframe.css";
const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  gap: 5px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    //슬라이드 첫번째
    transform-origin: center left;
  }
  &:last-child {
    //슬라이드 마지막
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const BannerBtn = styled.div`
  font-family: "Do Hyeon";
  font-weight: 800;
  font-size: 18px;
  width: 150px;
  text-align: center;
  color: black;
  background-color: ${(props) => props.theme.white.lighter};
  border-radius: 5px;
  margin: 5px 0;
  padding: 5px;
  margin-top: 15px;
  cursor: pointer;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: black;
    color: ${(props) => props.theme.white.lighter};
  }
`;
const IframeWrapper = styled.div``;
const offset = 6;

function Home() {
  let [alert, alertSet] = useState(true);
  useEffect(() => {
    let timer = setTimeout(() => {
      alertSet(false);
    }, 2000);
  });
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId"); //해당 url인지 아닌지판단

  //데이터api 받아오기

  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMoviesResult>(
    ["movie", "nowPlaying"],
    () => getMovies("now_playing")
  );
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetMoviesResult>(["movie", "popular"], () =>
      getMovies("popular")
    );
  const { data: topData, isLoading: topLoading } = useQuery<IGetMoviesResult>(
    ["movie", "top"],
    () => getMovies("top_rated")
  );
  const { data: upData, isLoading: upLoading } = useQuery<IGetMoviesResult>(
    ["movie", "upcoming"],
    () => getMovies("upcoming")
  );

  const { data: videoData, isLoading: videoLoading } =
    useQuery<IGetVideosResult>(["movies", "videos"], () => getVideo(616037));
  console.log("videoData", videoData);

  console.log(nowData);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const incraseIndex = () => {
    if (nowData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const moveBanner = (id: string) => {
    history.push(`/movie/${id}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {nowLoading ? (
        <Loader />
      ) : (
        <>
          {alert === true ? (
            <Banner
              onClick={incraseIndex}
              bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
            >
              <Title>{nowData?.results[0].title}</Title>
              <Overview>{nowData?.results[0].overview}</Overview>
              <BannerBtn
                onClick={() => moveBanner(nowData?.results[0].id + "")}
              >
                자세히 보기
              </BannerBtn>
            </Banner>
          ) : (
            <ReactPlayer
              className="player"
              url={"https://www.youtube.com/watch?v=tTAEQG3K-yU"}
              width="100vw"
              playing={true}
              muted={true}
              loop={true}
              controls={false}
              style={
                {
                  // position: "absolute",
                  // right: 150,
                  // backgroundColor: "transparent",
                }
              }
            >
              <Title>{nowData?.results[0].title}</Title>
              <Overview>{nowData?.results[0].overview}</Overview>
              <BannerBtn
                onClick={() => moveBanner(nowData?.results[0].id + "")}
              >
                자세히 보기
              </BannerBtn>
            </ReactPlayer>
          )}

          <MovieSlider kind="upcoming" data={upData} />
          <MovieSlider kind="now" data={nowData} />
          <MovieSlider kind="toprated" data={topData} />
          <MovieSlider kind="popular" data={popularData} />
          {/* 슬라이드 */}
          {/* <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset) // 6 * n에서 6 * n + 6 만 보여줌
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider> */}
          {/* 클릭시 디테일 */}
          {/* <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence> */}
        </>
      )}
    </Wrapper>
  );
}
export default Home;
