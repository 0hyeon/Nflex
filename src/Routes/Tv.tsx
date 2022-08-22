import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getTv, getTvDetail, IGetTv, IGetTvDetail } from "../api";
import Loader from "../Components/Loader";
import TvSlider from "../Components/TvSlider";
import { getPosterPath } from "../utils";

const Wrapper = styled.div`
  height: 300vh;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`;
const Banner = styled.div<{ posterPath: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 75vh;
  padding: 60px;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.3),
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.posterPath});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;
const BannerTitle = styled.h2`
  font-size: 48px;
  margin-bottom: 20px; ;
`;

const BannerOverview = styled.p`
  font-size: 20px;
  width: 50%;
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

function Tv() {
  // API 데이터 받아오기
  const { data: popularData, isLoading: popularLoading } = useQuery<IGetTv>(
    ["tv", "popular"],
    () => getTv("popular")
  );
  const { data: onairData, isLoading: onairLoading } = useQuery<IGetTv>(
    ["tv", "onair"],
    () => getTv("on_the_air")
  );
  const { data: topData, isLoading: topLoading } = useQuery<IGetTv>(
    ["tv", "top"],
    () => getTv("top_rated")
  );
  // 배너 API (우영우)
  const { data: bannerData, isLoading: bannerLoading } = useQuery<IGetTvDetail>(
    ["tv", "banner"],
    () => getTvDetail(String(197067))
  );

  const history = useHistory();

  const moveBanner = (id: string) => {
    history.push(`/tv/${id}`);
  };
  console.log(bannerData);
  // 불필요한 API 호출을 막음
  useEffect(() => {}, []);

  return (
    <Wrapper>
      {popularLoading && topLoading && onairLoading && bannerLoading ? (
        <Loader />
      ) : (
        <>
          <Helmet>
            <title>TV SHOWS: C-FLIX</title>
          </Helmet>
          <Banner posterPath={getPosterPath(bannerData?.backdrop_path || "")}>
            <BannerTitle>
              <span>{bannerData?.name}</span>
              {/* <span id="vote">★ {bannerData?.vote_average}</span> */}
            </BannerTitle>
            <BannerOverview>{bannerData?.overview}</BannerOverview>
            <BannerBtn onClick={() => moveBanner(bannerData?.id + "")}>
              자세히 보기
            </BannerBtn>
          </Banner>
          <TvSlider kind="popular" data={popularData} />
          <TvSlider kind="ontheair" data={onairData} />
          <TvSlider kind="toprated" data={topData} />
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
