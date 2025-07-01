import React, { useState, useEffect, useRef } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import "./ProjectDetail.css";

function ProjectDetail({ projectId, onNavigate }) {
  const glideRef = useRef(null);
  const glideInstanceRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [langMode, setLangMode] = useState("KO");

  const handleLangModeChange = (mode) => {
    setLangMode(mode);
  };

  const projects = [
    {
      id: 101,
      title: `오동숲속도서관`,
      titleEn: `Odong Public Library`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/1/main.jpg`,
        `/images/Architecture/detail/1/detail 1.jpg`,
        `/images/Architecture/detail/1/detail 2.jpg`,
        `/images/Architecture/detail/1/detail 3.jpg`,
        `/images/Architecture/detail/1/detail 4.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/1/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 3.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 4.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 102,
      title: `이상봉 타워`,
      titleEn: `Lie Sang Bong Tower`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/2/main.jpg`,
        `/images/Architecture/detail/2/detail 1.jpg`,
        `/images/Architecture/detail/2/detail 2.jpg`,
        `/images/Architecture/detail/2/detail 3.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/2/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 3.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 103,
      title: `헤이리, 코스미코`,
      titleEn: `Heyri COSMICO`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/3/main.jpg`,
        `/images/Architecture/detail/3/detail 1.jpg`,
        `/images/Architecture/detail/3/detail 2.jpg`,
        `/images/Architecture/detail/3/detail 3.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/3/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 3.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 104,
      title: `오동숲속도서관`,
      titleEn: `Odong Public Library`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/1/main.jpg`,
        `/images/Architecture/detail/1/detail 1.jpg`,
        `/images/Architecture/detail/1/detail 2.jpg`,
        `/images/Architecture/detail/1/detail 3.jpg`,
        `/images/Architecture/detail/1/detail 4.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/1/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 3.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 4.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 105,
      title: `이상봉 타워`,
      titleEn: `Lie Sang Bong Tower`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/2/main.jpg`,
        `/images/Architecture/detail/2/detail 1.jpg`,
        `/images/Architecture/detail/2/detail 2.jpg`,
        `/images/Architecture/detail/2/detail 3.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/2/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 3.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 106,
      title: `헤이리, 코스미코`,
      titleEn: `Heyri COSMICO`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/3/main.jpg`,
        `/images/Architecture/detail/3/detail 1.jpg`,
        `/images/Architecture/detail/3/detail 2.jpg`,
        `/images/Architecture/detail/3/detail 3.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/3/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 3.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 201,
      title: `인간산수`,
      titleEn: `Human, Space, Mountain, Water`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Art/detail/1/main.jpg`,
        `/images/Art/detail/1/detail 1.jpg`,
        `/images/Art/detail/1/detail 2.jpg`,
        `/images/Art/detail/1/detail 3.jpg`,
        `/images/Art/detail/1/detail 4.jpg`,
        `/images/Art/detail/1/detail 5.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Art/detail/1/main.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail1.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail2.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail3.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail4.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail5.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 202,
      title: `인간산수`,
      titleEn: `Human, Space, Mountain, Water`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Art/detail/1/main.jpg`,
        `/images/Art/detail/1/detail1.jpg`,
        `/images/Art/detail/1/detail2.jpg`,
        `/images/Art/detail/1/detail3.jpg`,
        `/images/Art/detail/1/detail4.jpg`,
        `/images/Art/detail/1/detail5.jpg`,
      ],
      videos: [`https://www.youtube.com/watch?v=8mXBW8Qxwxs`],
      media: [
        { type: "video", src: `https://www.youtube.com/watch?v=8mXBW8Qxwxs` },
        { type: "image", src: `/images/Art/detail/1/main.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail1.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail2.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail3.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail4.jpg` },
        { type: "image", src: `/images/Art/detail/1/detail5.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 203,
      title: `인간산수`,
      titleEn: `Human, Space, Mountain, Water`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Art/detail/1/main.jpg`,
        `/images/Art/detail/1/detail 1.jpg`,
        `/images/Art/detail/1/detail 2.jpg`,
        `/images/Art/detail/1/detail 3.jpg`,
        `/images/Art/detail/1/detail 4.jpg`,
        `/images/Art/detail/1/detail 5.jpg`,
      ],
      videos: [],
      media: [{ type: "image", src: `/images/Art/detail/1/main.jpg` }],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 301,
      title: `오동숲속도서관`,
      titleEn: `Odong Public Library`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/1/main.jpg`,
        `/images/Architecture/detail/1/detail 1.jpg`,
        `/images/Architecture/detail/1/detail 2.jpg`,
        `/images/Architecture/detail/1/detail 3.jpg`,
        `/images/Architecture/detail/1/detail 4.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/1/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 3.jpg` },
        { type: "image", src: `/images/Architecture/detail/1/detail 4.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 302,
      title: `이상봉 타워`,
      titleEn: `Lie Sang Bong Tower`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/2/main.jpg`,
        `/images/Architecture/detail/2/detail 1.jpg`,
        `/images/Architecture/detail/2/detail 2.jpg`,
        `/images/Architecture/detail/2/detail 3.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/2/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/2/detail 3.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
    {
      id: 303,
      title: `헤이리, 코스미코`,
      titleEn: `Heyri COSMICO`,
      year: `2024`,
      location: `서울 성북구 Seoul Seongbuk-gu`,
      type: `HOUSE`,
      client: `Client name`,
      director: `Yoongyoo Jang, Changhoon Shin`,
      status: `Completed`,
      images: [
        `/images/Architecture/detail/3/main.jpg`,
        `/images/Architecture/detail/3/detail 1.jpg`,
        `/images/Architecture/detail/3/detail 2.jpg`,
        `/images/Architecture/detail/3/detail 3.jpg`,
      ],
      videos: [],
      media: [
        { type: "image", src: `/images/Architecture/detail/3/main.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 1.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 2.jpg` },
        { type: "image", src: `/images/Architecture/detail/3/detail 3.jpg` },
      ],
      description: `오동공원은 도시에 존재하는 거대한 산책로를 가진 흥미로운 공원이다. 경사지를 따라 데크의 연속으로 이루어진 공원의 산책로는 다양한 프로그램을 수용하며 시민들에게 여가와 휴식을 제공한다. 오동숲속도서관은 산책로의 시작점에 자리 잡아 공원길의 연장으로서의 공간을 제안한다. 길의 연장으로 점점 가운데 공간을 향하여 회전하는 데크를 지붕의 구조로 변형시켜 하부에 열린 공간을 구성하였다. 나선형으로 폴딩된 지붕 공간은 서로 다른 높이의 차이를 가짐으로써 틈 사이로 자연채광의 빛이 쏟아지는 경험을 가진다. 내부에서는 투명성의 공간으로 작용하며 반외부적 공간의 경험을 제공한다.
      
          공간을 이루는 기본단위는 벽 대신 책꽂이 월(wall)인 가구적 구조로부터 시작한다. 책꽂이 월은 공간을 구성하는 구조이면서 분할이고 배분하는 장치이다. 책꽂이 월은 유동하는 공간을 구성하여 서로 소통하며 통합되고 혹은 적절히 독립되는 이중적인 미로 구조를 재현한다. 즉, 가구와 공간과 구조의 조화를 실현하려 한다. 작은 도서관이지만 이곳에 오는 다양한 지역주민이 유동하는 공간 곳곳에서 자신들의 목적성과 유목성을 동시에 경험할 수 있다.`,
      descriptionEn: `Odong Park is a unique urban park featuring a large promenade that extends along a gentle slope. This promenade, composed of a sequence of decks, hosts a variety of programs and offers citizens a place for rest and leisure. Situated at the starting point of the promenade is the Odong Public Library, envisioned as a spatial extension of the park's pathway. As the path continues, the deck gradually rotates inward, transforming into a roof structure that creates an open space beneath. This spiraling, folded roof allows natural light to filter through gaps at varying heights, creating a semi-outdoor atmosphere filled with transparency and light.

The space is composed of a fundamental unit: a furniture-like structure that functions as a bookcase wall rather than a conventional wall. These bookcase walls serve not only as structural elements but also as devices for dividing and distributing the space. They create a continuous, flowing environment that encourages interaction while forming a dual-layered maze—both interconnected and independently defined. In doing so, the design aims to harmonize furniture, space, and structure. Though modest in scale, the library offers a multi-faceted experience of purpose and movement, reflecting the dynamic rhythms of the local community who gather and flow through the space.`,
    },
  ];

  const project = projects.find((p) => p.id === parseInt(projectId));

  // 모달 관련 함수들
  const openImgModal = (imageIndex) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const closeImgModal = () => {
    setIsModalOpen(false);
  };

  // 모달이 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // 페이지 첫 로드 시에만 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // 빈 의존성 배열로 첫 렌더링에만 실행

  // Glide.js 초기화
  useEffect(() => {
    // media 배열이 있으면 우선 사용, 없으면 기존 방식 사용
    const totalSlides = project?.media
      ? project.media.length
      : (project?.images?.length || 0) + (project?.videos?.length || 0);
    if (
      glideRef.current &&
      project &&
      totalSlides > 1 &&
      !glideInstanceRef.current
    ) {
      const glide = new Glide(glideRef.current, {
        type: "carousel",
        startAt: 0,
        perView: 1,
        gap: 0,
        keyboard: true,

        // === 속도 관련 설정 ===
        animationDuration: 1200, // 슬라이드 전환 시간 (밀리초) - 기본값: 400
        animationTimingFunc: "ease", // 애니메이션 커브

        // 자동 재생 (옵션)
        // autoplay: 3000,  // 3초마다 자동 슬라이드 (밀리초)

        // 터치/드래그 속도
        dragThreshold: 120, // 드래그 최소 거리 (픽셀) - 기본값: 120
        touchRatio: 0.5, // 터치 감도 (0.1 ~ 1) - 기본값: 0.5
      });

      glide.mount();
      glideInstanceRef.current = glide; // 인스턴스 저장
    }

    return () => {
      if (glideInstanceRef.current) {
        glideInstanceRef.current.destroy();
        glideInstanceRef.current = null;
      }
    };
  }, [project?.id]); // 프로젝트 ID가 변경될 때만 실행 (모달 상태 변경과 무관)

  if (!project) {
    // 프로젝트 ID에 따라 돌아갈 페이지 결정
    const getBackPage = () => {
      const id = parseInt(projectId);
      if (id >= 100 && id < 200) return "architecture";
      if (id >= 200 && id < 300) return "art";
      if (id >= 300 && id < 400) return "design";
      return "architecture"; // 기본값
    };

    return (
      <div className="project-detail-container">
        <div className="project-not-found">
          <h2>프로젝트를 찾을 수 없습니다</h2>
          <button onClick={() => onNavigate(getBackPage())}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      {/* 프로젝트 헤더 */}
      <div className="project-header">
        <div className="project-header-info">
          <h1 className="project-detail-title">{project.title}</h1>
          <h2 className="project-detail-title-en">{project.titleEn}</h2>
        </div>
      </div>

      {/* 메인 이미지 갤러리 */}
      <div className="project-gallery">
        {(() => {
          // media 배열이 있으면 우선 사용
          const totalSlides = project.media
            ? project.media.length
            : (project.images?.length || 0) + (project.videos?.length || 0);

          if (totalSlides === 1) {
            // 단일 미디어인 경우
            if (project.media) {
              const media = project.media[0];
              return (
                <div className="single-image-container">
                  {media.type === "image" ? (
                    <img
                      src={media.src}
                      alt={project.title}
                      className="single-image"
                      onClick={() => openImgModal(0)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    (() => {
                      const video = media.src;
                      let embedUrl = video;
                      if (video.includes("youtube.com/watch?v=")) {
                        const videoId = video.split("v=")[1].split("&")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      } else if (video.includes("youtu.be/")) {
                        const videoId = video
                          .split("youtu.be/")[1]
                          .split("?")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      }

                      return (
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: "100%", height: "100%" }}
                        ></iframe>
                      );
                    })()
                  )}
                </div>
              );
            } else {
              // 기존 방식 (하위 호환성)
              return (
                <div className="single-image-container">
                  {project.images?.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="single-image"
                      onClick={() => openImgModal(0)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    (() => {
                      const video = project.videos[0];
                      let embedUrl = video;
                      if (video.includes("youtube.com/watch?v=")) {
                        const videoId = video.split("v=")[1].split("&")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      } else if (video.includes("youtu.be/")) {
                        const videoId = video
                          .split("youtu.be/")[1]
                          .split("?")[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                      }

                      return (
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: "100%", height: "100%" }}
                        ></iframe>
                      );
                    })()
                  )}
                </div>
              );
            }
          } else {
            // 다중 미디어인 경우 (슬라이더)
            return (
              <div className="glide" ref={glideRef}>
                <div className="glide__track" data-glide-el="track">
                  <ul className="glide__slides">
                    {project.media ? (
                      // media 배열 사용
                      project.media.map((media, index) => (
                        <li key={`media-${index}`} className="glide__slide">
                          {media.type === "image" ? (
                            <img
                              src={media.src}
                              alt={`${project.title} - ${index + 1}`}
                              className="slide-image"
                              onClick={() => openImgModal(index)}
                              style={{ cursor: "pointer" }}
                            />
                          ) : (
                            (() => {
                              const video = media.src;
                              let embedUrl = video;
                              if (video.includes("youtube.com/watch?v=")) {
                                const videoId = video
                                  .split("v=")[1]
                                  .split("&")[0];
                                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              } else if (video.includes("youtu.be/")) {
                                const videoId = video
                                  .split("youtu.be/")[1]
                                  .split("?")[0];
                                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              }

                              return (
                                <iframe
                                  src={embedUrl}
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  style={{ width: "100%", height: "100%" }}
                                ></iframe>
                              );
                            })()
                          )}
                        </li>
                      ))
                    ) : (
                      // 기존 방식 (하위 호환성)
                      <>
                        {project.images?.map((image, index) => (
                          <li key={`image-${index}`} className="glide__slide">
                            <img
                              src={image}
                              alt={`${project.title} - ${index + 1}`}
                              className="slide-image"
                              onClick={() => openImgModal(index)}
                              style={{ cursor: "pointer" }}
                            />
                          </li>
                        ))}
                        {project.videos?.map((video, index) => {
                          // 유튜브 URL을 embed URL로 변환
                          let embedUrl = video;
                          if (video.includes("youtube.com/watch?v=")) {
                            const videoId = video.split("v=")[1].split("&")[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          } else if (video.includes("youtu.be/")) {
                            const videoId = video
                              .split("youtu.be/")[1]
                              .split("?")[0];
                            embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          }

                          return (
                            <li key={`video-${index}`} className="glide__slide">
                              <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: "100%", height: "100%" }}
                              ></iframe>
                            </li>
                          );
                        })}
                      </>
                    )}
                  </ul>
                </div>

                {/* 네비게이션 화살표 */}
                <div className="glide__arrows" data-glide-el="controls">
                  <button
                    className="glide__arrow glide__arrow--left"
                    data-glide-dir="<"
                  >
                    ←
                  </button>
                  <button
                    className="glide__arrow glide__arrow--right"
                    data-glide-dir=">"
                  >
                    →
                  </button>
                </div>

                {/* 불릿 인디케이터 */}
                <div className="glide__bullets" data-glide-el="controls[nav]">
                  {project.media
                    ? project.media.map((_, index) => (
                        <button
                          key={index}
                          className="glide__bullet"
                          data-glide-dir={`=${index}`}
                        />
                      ))
                    : [
                        ...(project.images || []),
                        ...(project.videos || []),
                      ].map((_, index) => (
                        <button
                          key={index}
                          className="glide__bullet"
                          data-glide-dir={`=${index}`}
                        />
                      ))}
                </div>
              </div>
            );
          }
        })()}
      </div>

      {/* 프로젝트 정보 */}
      <div className="project-content">
        <div className="project-description">
          <div className="lang-options">
            <button
              className={`lang-btn ${langMode === "KO" ? "active" : ""}`}
              onClick={() => handleLangModeChange("KO")}
            >
              KO
            </button>
            <span className="lang-separator">/</span>
            <button
              className={`lang-btn ${langMode === "EN" ? "active" : ""}`}
              onClick={() => handleLangModeChange("EN")}
            >
              EN
            </button>
          </div>
          <div
            className={`project-description-ko ${
              langMode === "KO" ? "active" : ""
            }`}
          >
            {project.description}
          </div>
          <div
            className={`project-description-en ${
              langMode === "EN" ? "active" : ""
            }`}
          >
            {project.descriptionEn}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-line"></div>
          <div className="detail-grid">
            <div className="detail-grid-left">
              <div className="detail-row">
                <span className="detail-label">YEAR</span>
                <span className="detail-value">{project.year}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">TYPE</span>
                <span className="detail-value">{project.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">LOCATION</span>
                <span className="detail-value">{project.location}</span>
              </div>
            </div>
            <div className="detail-grid-right">
              <div className="detail-row">
                <span className="detail-label">CLIENT</span>
                <span className="detail-value">{project.client}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">DIRECTOR</span>
                <span className="detail-value">{project.director}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">STATUS</span>
                <span className="detail-value">{project.status}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 이미지 모달 */}
      {isModalOpen && (
        <div className="image-modal" onClick={closeImgModal}>
          <img
            src={project.images[modalImageIndex]}
            alt={`${project.title} - ${modalImageIndex + 1}`}
            className="image-modal-image"
          />
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
