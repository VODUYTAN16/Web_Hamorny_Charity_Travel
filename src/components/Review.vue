<template>
  <div
    id="carouselExample"
    class="carousel slide"
    data-bs-ride="carousel"
    data-bs-interval="3000"
  >
    <div class="carousel-inner">
      <div
        class="carousel-item"
        :class="{ active: index === 0 }"
        v-for="(group, index) in groupedFeedbacks"
        :key="index"
      >
        <div class="row justify-content-center">
          <div
            class="col-md-4"
            v-for="(feedback, idx) in group"
            :key="`group-${index}-feedback-${idx}`"
          >
            <div class="feedback-card text-center">
              <img
                :src="feedback.image"
                alt="Client"
                class="client-image mx-auto"
              />
              <h3 class="mt-3">{{ feedback.name }}</h3>
              <blockquote class="blockquote fst-italic mt-2">
                {{ feedback.text }}
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Controls -->
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedbacks: [
        {
          image:
            'https://i.pinimg.com/474x/ed/b6/f1/edb6f1266815a40877fc64b59d5d7f8a.jpg',
          name: 'John Doe',
          text: 'This is an awesome service! The team went above and beyond to make our trip unforgettable. Their attention to detail and local expertise made every moment special. I can not recommend them enough!',
        },
        {
          image:
            'https://i.pinimg.com/474x/c9/d6/cb/c9d6cb15d77253cfdc6e7330a5f016a3.jpg',
          name: 'Asa Walter',
          text: 'They completely transformed our corporate retreat! From seamless logistics to unique local experiences, every aspect was perfectly curated. Our team came back inspired and reconnected.',
        },
        {
          image:
            'https://i.pinimg.com/736x/95/2a/d1/952ad13f74d994f086552050ebc2432d.jpg',
          name: 'Zahid Miles',
          text: "Loved working with them! Their guides felt like friends showing us their hometown. We discovered hidden cafes, secret viewpoints, and cultural gems we'd never find on our own.",
        },
        {
          image:
            'https://i.pinimg.com/474x/83/28/59/8328593d9642ca303f78c6c5fa4d6eca.jpg',
          name: 'Casper Leigh',
          text: 'I will continue using their services for all my travels. The personalized itineraries and 24/7 support give me peace of mind while exploring new destinations. Truly exceptional!',
        },
      ],
      size: 3,
    };
  },

  methods: {
    updateSize() {
      this.size = window.innerWidth < 768 ? 1 : 3;
    },
  },
  computed: {
    groupedFeedbacks() {
      // Nhóm feedback thành các nhóm 3 phần tử
      // const size = window.innerWidth < 768 ? 1 : 3;
      window.addEventListener('resize', this.updateSize);
      return this.feedbacks.reduce((result, item, index) => {
        const groupIndex = Math.floor(index / this.size);
        if (!result[groupIndex]) result[groupIndex] = [];
        result[groupIndex].push(item);
        return result;
      }, []);
    },
  },
};
</script>

<style scoped>
.feedback-card {
  max-width: 800px;
  height: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: rgb(240, 240, 240);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.client-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgb(0, 0, 0, 0.2);
  border-radius: 50%;
}
</style>
