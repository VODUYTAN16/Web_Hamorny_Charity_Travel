<template>
    <div class="body">
        <header>
            <Navigate></Navigate>
            <HeroSection image="https://media.istockphoto.com/id/1154241782/vi/anh/ph%E1%BB%91-c%E1%BB%95-h%E1%BB%99i-an-v%C3%A0o-bu%E1%BB%95i-s%C3%A1ng.jpg?s=2048x2048&w=is&k=20&c=W77qSC4nfw_c0xGXhV8y3tfA2raTwsklv9rZEbj9Heg="></HeroSection>
            <div class="welcome">
                <h1>Stop Sabotaging Your Own Success: Discover the 6 Red Flags Holding You Back from a Fulfilling Life!</h1>
                <h3>Uncover the Hidden Obstacles Blocking Your Success and Learn How to Realign Your Life with Clarity, Purpose, and Fulfillment—Before It's Too Late.</h3>
            </div>
        </header>
        <main>
            <div class="container">
                <div class="row ">
                <h1 class="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, veniam dolorum.</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem eius doloremque deserunt velit soluta, reprehenderit, doloribus assumenda natus recusandae illo quis magnam aliquid, id est cupiditate vel maiores ipsum sapiente?</p>
                </div>
            </div>
            <div class="container">
                <Form></Form>
            </div>
            <Footer></Footer>
        </main>
    </div>
</template>

<style scoped>
header {
    position: relative;
}

.welcome {
    position: absolute;
    bottom: 30px;  /* Căn dưới một chút để tránh bị dính vào dưới cùng */
    left: 50%;
    transform: translateX(-50%);  /* Căn giữa theo chiều ngang */
    color: white;
    text-align: right;
    width: 80%;  /* Đảm bảo phần tử có chiều rộng phù hợp với màn hình */
    max-width: 900px;  /* Giới hạn chiều rộng tối đa */
    padding: 30px;
    background-color: rgba(31, 68, 95, 0.95); /* Sử dụng rgba để có độ trong suốt */
    border-radius: 50px 0 50px 0;
}

@media (max-width: 768px) {
    .welcome {
        width: 90%;  /* Điều chỉnh chiều rộng trên các màn hình nhỏ */
        padding: 20px;
    }
}

</style>

<script setup>
import Navigate from '@/components/Navigate.vue';
import HeroSection from '@/components/HeroSection.vue';
import Form from '@/components/Form.vue';
import Footer from '@/components/Footer.vue';
</script>