import { IGetMoviesResult } from "../api";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import nextImg from "../asset/images/next1.png";
import prevImg from "../asset/images/prev1.png";
import { getPosterPath } from "../utils";
import DetailMovie from "./DetailMovie";
import Loader from "./Loader";

const Slider = styled.div`
  position: relative;
  height: 30vh;
`;
const SliderTitle = styled.h2`
  margin-bottom: 20px;
  padding-left: 10px;
  color: white;
  font-weight: 800;
`;
const SliderRow = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  padding: 0 5px;
`;
const Box = styled(motion.div)<{ posterpath: string }>`
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
    url(${(props) => props.posterpath});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Song Myung";
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  color: ${(props) => props.theme.black.lighter};
  border-radius: 12px;
  cursor: pointer;
  text-shadow: 2px 2px 2px black;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  #title {
    padding: 0 40px;
    color: white;
  }
  &:first-child {
    margin-left: 5px;
    transform-origin: center left;
  }
  &:last-child {
    margin-right: 5px;
    transform-origin: center right;
  }
`;
const BoxBottom = styled(motion.div)`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  span {
    text-align: center;
    margin: 2px 0;
    font-size: 12px;
    font-weight: 600;
    font-family: "돋움";
    text-shadow: none;
  }
  #vote {
    font-weight: 800;
    font-size: 16px;
    color: ${(props) => props.theme.red};
  }
`;
const PrevIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 120px;
  left: 0;
  cursor: pointer;
`;
const NextIcon = styled(motion.img)`
  position: absolute;
  width: 60px;
  top: 120px;
  right: 0;
  cursor: pointer;
`;
const IconVariants: Variants = {
  initial: {
    opacity: 0.3,
  },
  hover: {
    opacity: 0.7,
  },
};
const RowVariants: Variants = {
  hidden: (isNext: boolean) => {
    return {
      x: isNext ? window.innerWidth : -window.innerWidth,
    };
  },
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => {
    return {
      x: isNext ? -window.innerWidth : window.innerWidth,
    };
  },
};
const BoxHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.5,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};
const BoxBottomVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface IProps {
  kind: string;
  data?: IGetMoviesResult;
}
function MovieSlider({ kind, data }: IProps) {
  const [titleName, setTitle] = useState("");
  const [isSearch, setSearch] = useState(false);

  useEffect(() => {
    switch (kind) {
      case "upcoming":
        setTitle("상영예정 영화");
        break;
      case "now":
        setTitle("상영중인 영화");
        break;
      case "popular":
        setTitle("인기있는 영화");
        break;
      case "toprated":
        setTitle("평점높은 영화");
        break;
      case "search":
        setTitle("영화");
        setSearch(true);
        break;
    }
  }, [kind]);

  // 슬라이드 다음페이지 넘기기 위한 인덱스
  const [index, setIndex] = useState(0);

  // 슬라이드 애니메이션 방향 설정
  const [isNext, setIsNext] = useState(true);

  // isLeave: 슬라이드 내에 이동중인 애니메이션이 끝났는지 확인
  // toggleLeave: 기존 값과 반대로 설정
  const [isLeave, setIsLeave] = useState(false);
  const toggleLeave = () => setIsLeave((prev) => !prev);

  // offset = 슬라이더 내에 한번에 보여주고 싶은 영화 개수
  const offset = 6;

  // Box 클릭 시, url 이동하기 위해 (모달창)
  const history = useHistory();

  // movieMatch: "/movie/:id" URL로 이동하였는지 확인한다.
  // searchMatch: "/search/movie/:id" URL로 이동하였는지 확인한다.
  const movieMatch = useRouteMatch<{ id: string }>("/movie/:id");
  const searchMatch = useRouteMatch<{ id: string }>("/search/movie/:id");

  /* ---------- Functions  ----------  */
  /* nextIndex(): 인덱스 증가시키는 함수, 다음 슬라이드로  */
  /* prevIndex(): 인덱스 감소시키는 함수, 이전 슬라이드로  */
  /* clickBox(): 박스(슬라이드)를 클릭했을 때 실행되는 함수  */

  const nextIndex = () => {
    if (data) {
      // 애니메이션 아직 안끝남
      if (isLeave) return;
      else {
        // API data.length
        const mvLength = data.results.length;
        const maxIndex = Math.floor(mvLength / offset);

        toggleLeave();

        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        setIsNext(() => true);
      }
    }
  };
  const prevIndex = () => {
    if (data) {
      // 애니메이션 아직 안끝남
      if (isLeave) return;
      else {
        // API data.length
        const mvLength = data.results.length;
        const maxIndex = Math.ceil(mvLength / offset);

        toggleLeave();

        setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
        setIsNext(() => false);
      }
    }
  };
  const clickBox = (id: number) => {
    setTimeout(() => {
      // 검색페이지에서 모달을 클릭했는지 확인
      if (isSearch) {
        history.push(`/search/movie/${id}`);
      } else {
        history.push(`/movie/${id}`);
      }
    }, 50);
  };
  return (
    <>
      {data ? (
        <>
          {/* Slider */}
          <Slider>
            <SliderTitle>{titleName}</SliderTitle>
            <AnimatePresence
              custom={isNext}
              onExitComplete={toggleLeave}
              initial={false}
            >
              <SliderRow
                key={index}
                transition={{ type: "tween", duration: 1 }}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={isNext}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      posterpath={getPosterPath(
                        movie.backdrop_path
                          ? movie.backdrop_path
                          : movie.poster_path
                      )}
                      variants={BoxHoverVariants}
                      initial="initial"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => clickBox(movie.id)}
                    >
                      <span id="title">
                        {movie.title
                          ? movie.title.split(":", 1)
                          : movie.original_title.split(":", 1)}
                      </span>
                      <BoxBottom variants={BoxBottomVariants}>
                        <span id="vote">
                          {movie.vote_average ? "★" : ""}
                          {movie.vote_average ? movie.vote_average : ""}
                        </span>
                        <span style={{ color: "white" }}>
                          개봉일: {movie.release_date}
                        </span>
                      </BoxBottom>
                    </Box>
                  ))}
              </SliderRow>
            </AnimatePresence>
            <PrevIcon
              src={prevImg}
              variants={IconVariants}
              initial="initial"
              whileHover="hover"
              onClick={prevIndex}
            />
            <NextIcon
              src={nextImg}
              variants={IconVariants}
              initial="initial"
              whileHover="hover"
              onClick={nextIndex}
            />
          </Slider>

          {/* Modal */}
          <AnimatePresence>
            {movieMatch ? (
              <DetailMovie id={movieMatch.params.id} kind={kind} />
            ) : null}
            {searchMatch ? (
              <DetailMovie id={searchMatch.params.id} kind={kind} />
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}
export default MovieSlider;
