<template>
  <div class="body">
    <header>
      <Navigate class="navigate"></Navigate>
      <HeroSection image="https://media.istockphoto.com/id/488876192/vi/anh/hoi-an-vietnam.jpg?s=2048x2048&w=is&k=20&c=i9PyzEChi5gMuB4Jf1HAzOmdEmY28_Bo3aBVx0tJb3Q=" p1="HARMONY CHARITY TRAVEL" p2="VOLUNTEER & CULTURE"></HeroSection>
    </header>
    <main>
      <CardsLayout></CardsLayout>
      <Feedback></Feedback>
      <Subscribe></Subscribe>
      <Footer></Footer>
    </main>
  </div>
</template>

<style>
.navigatge{
  margin: auto;
}
</style>

<script setup>
import Navigate from '@/components/Navigate.vue';
import HeroSection from '@/components/HeroSection.vue';
import CardsLayout from '@/components/CardsLayout.vue';
import Footer from '@/components/Footer.vue';
import Feedback from '@/components/Feedback.vue';
import Subscribe from '@/components/Subscribe.vue';
</script>

