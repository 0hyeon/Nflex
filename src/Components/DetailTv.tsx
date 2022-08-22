import { AnimatePresence, motion, Variants } from "framer-motion";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getTvCredit, getTvDetail, IGetTvCredit, IGetTvDetail } from "../api";

import { getPosterPath } from "../utils";
import Loader from "./Loader";

const Modal = styled(motion.div)`
  z-index: 99;
  position: absolute;
  width: 40vw;
  top: 15%;
  left: 0;
  right: 0;
  margin: 0 auto;
  color: ${(props) => props.theme.black.darker};
  border-radius: 13px;
  background-color: ${(props) => props.theme.black.darker};
  /* 스크롤바 활성화 및 숨기기 */
  overflow-y: scroll;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;
const ModalPoster = styled.div<{ posterpath: string }>`
  border-radius: 12px 12px 0 0;
  height: 300px;
  background-color: white;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
    url(${(props) => props.posterpath});
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  color: ${(props) => props.theme.white.lighter};
  cursor: pointer;
  text-shadow: 2px 2px 2px black;
  #tagline {
    font-size: 20px;
  }
`;
const Genrs = styled.div`
  margin-top: 30px;
  font-family: "Nanum Myeongjo";
  text-shadow: none;
  font-size: 18px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  span {
    border-radius: 7px;
    padding: 5px;
    margin: 0 5px;
    background-color: ${(props) => props.theme.black.darker};
  }
`;
const ModalPrevInfo = styled.div`
  /* display: flex;
  justify-content: flex-start;
  align-items: center; */
  width: 100%;
  height: 230px;
  padding: 5px 10px;
  text-align: center;
  /* font-size: 15px; */
  margin-bottom: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  span {
    /* display: flex;
    justify-content: flex-start;
    align-items: center; */
    text-align: left;
    margin-right: 10px;
    color: white;
  }
  #star {
    font-size: 22px;
    color: ${(props) => props.theme.red};
    &:first-child {
      margin-right: 3px;
    }
  }
`;
const ModalCreditsInfo = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0 30px;
`;
const ModalNextInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  #title {
    font-size: 18px;
    color: grey;
    margin-bottom: 10px;
  }
  #name {
    margin: 10px 20px;
    color: white;
  }
`;
const ModalInfoImg = styled.div<{ posterpath: string }>`
  background-image: url(${(props) => props.posterpath});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border-radius: 50px;
  margin: 0 10px;
`;
const ModalInfoCast = styled.div`
  display: flex;
  justify-content: center;
  #title {
    font-size: 18px;
    color: grey;
    margin-bottom: 10px;
  }
  #name {
    font-size: 14px;
  }
`;

const modalVariants: Variants = {
  initial: { opacity: 0 },
  click: { opacity: 1 },
  exit: { opacity: 0 },
};
const OverlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
  },
};

interface IProps {
  id: string;
  kind: string;
}
function DetailTv({ id, kind }: IProps) {
  // 상세정보 및 캐스팅 정보 API data
  const { data: detailData, isLoading: detailLoading } = useQuery<IGetTvDetail>(
    ["tv", `${kind}_detail`],
    () => getTvDetail(id)
  );
  const { data: creditData, isLoading: creditLoading } = useQuery<IGetTvCredit>(
    ["tv", `${kind}_credit`],
    () => getTvCredit(id)
  );

  // 감독 한명 선택
  const Directing = creditData?.crew.find(
    (people) => people.known_for_department === "Directing"
  );
  // 출연징 정보 (3명)
  const Casting = creditData?.cast.slice(0, 3);

  // overlay 클릭 시, URL 이동하기 위해 (모달창)
  const history = useHistory();

  /* clickOverlay(): 오버레이 클릭 시, 이전 페이지로 이동하는 함수  */
  const clickOverlay = () => {
    history.goBack();
  };

  return (
    <AnimatePresence>
      {creditLoading && detailLoading ? (
        <Loader />
      ) : (
        <Overlay
          onClick={clickOverlay}
          variants={OverlayVariants}
          initial="initial"
          animate="visible"
          exit="exit"
        >
          <Modal
            variants={modalVariants}
            initial="initial"
            animate="click"
            exit="exit"
          >
            {detailData ? (
              <>
                <Helmet>
                  <title>
                    {detailData.name
                      ? detailData.name
                      : detailData.original_name}
                  </title>
                </Helmet>

                <ModalPoster
                  posterpath={getPosterPath(
                    detailData.backdrop_path
                      ? detailData.backdrop_path
                      : detailData.poster_path
                  )}
                >
                  <span id="title">{detailData.name}</span>
                  <Genrs>
                    {detailData.genres.map((genre) => (
                      <span key={genre.id} id="genrs">
                        {genre.name}
                      </span>
                    ))}
                  </Genrs>
                </ModalPoster>
                <ModalPrevInfo>
                  <span id="star">★</span>
                  <span id="star">
                    {detailData.vote_average ? detailData.vote_average : "0.0"}
                  </span>
                  <span>
                    {detailData.overview
                      ? detailData.overview
                      : "설명이 없습니다"}
                  </span>
                </ModalPrevInfo>

                <ModalCreditsInfo>
                  <ModalNextInfo>
                    <span id="title">Director</span>
                    <ModalInfoImg
                      posterpath={getPosterPath(
                        Directing?.profile_path ? Directing?.profile_path : ""
                      )}
                    />
                    <span id="name">{Directing?.original_name}</span>
                  </ModalNextInfo>

                  <ModalInfoCast>
                    {Casting?.map((Cast) => (
                      <ModalNextInfo key={Cast.id}>
                        <span id="title">Actor</span>
                        <ModalInfoImg
                          posterpath={getPosterPath(
                            Cast?.profile_path ? Cast?.profile_path : ""
                          )}
                        />
                        <span id="name">{Cast?.original_name}</span>
                      </ModalNextInfo>
                    ))}
                  </ModalInfoCast>
                </ModalCreditsInfo>
              </>
            ) : null}
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
export default DetailTv;
