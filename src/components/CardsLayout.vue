<script setup>
import Card from './Card.vue';

// document.addEventListener("DOMContentLoaded", function () {
//     const video = document.getElementById("myVideo");

//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 video.play(); // Phát video khi xuất hiện trong khung nhìn
//             } else {
//                 video.pause(); // Tạm dừng video khi ra khỏi khung nhìn
//             }
//         });
//     });

//     observer.observe(video); // Theo dõi video
// });
</script>

<template>
  <div class="cardslayout container text-center justify-content-center">
    <div class="cards row justify-content-center">
      <Card
        title="Local Guides"
        description="Discover your destination with our experienced local guides. We connect you with experts who know the hidden gems, culture, and history of the area. Let us make your journey more authentic and meaningful!?"
        image="https://i.pinimg.com/736x/ce/b7/77/ceb77763743d02ed0b8f2970fd807466.jpg"
        buttonLink="/About"
        buttonText="Meet The Team"
      />
      <Card
        title="Unique Accommodation"
        description="Our team is made up of passionate travelers and dedicated professionals. From tour organizers to enthusiastic guides, we’re here to ensure your trip is unforgettable. Get to know the people behind your adventure!"
        image="https://i.pinimg.com/736x/be/45/d0/be45d0b0c9cef355b656923698219aeb.jpg"
        buttonLink="/About"
        buttonText="Where we stay"
      />
      <Card
        title="Giving Back Projects"
        description="Travel with a purpose. Our initiatives support local communities through education, conservation, and sustainable development. Join us in making a positive impact wherever we go."
        image="https://i.pinimg.com/736x/56/54/89/5654899f3c367d70e82b25e42f306a07.jpg"
        buttonLink="/Ebook"
        buttonText="Charity Project"
      />
    </div>
    <iframe
      style="border-radius: 10px"
      class="embed-responsive-item video"
      id="myVideo"
      src="https://www.youtube.com/embed/NSnkb1IAjbE?autoplay=1&mute=1"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.cardslayout {
  min-width: 100%;
  background-color: #4f92bf;
  margin: 0;
  height: max-content;
}
.cards {
  padding: 40px;
}

@media (max-width: 576px) {
  iframe {
    width: 80%;
    height: 300px;
  }
}

/* Khi màn hình có độ rộng từ 768px trở lên (md) */
@media (min-width: 768px) {
  iframe {
    width: 70%;
    height: 500px;
    margin: 30px;
  }
}
</style>
