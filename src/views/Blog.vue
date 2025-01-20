<template>
  <div class="body">
    <header>
      <Navigate></Navigate>
      <div class="heroimage">
        <HeroSection
          image="https://media.istockphoto.com/id/1154241782/vi/anh/ph%E1%BB%91-c%E1%BB%95-h%E1%BB%99i-an-v%C3%A0o-bu%E1%BB%95i-s%C3%A1ng.jpg?s=2048x2048&w=is&k=20&c=W77qSC4nfw_c0xGXhV8y3tfA2raTwsklv9rZEbj9Heg="
          p1="Meaningful Adventures"
          p2="Charity Stories from Our Tours"
        ></HeroSection>
      </div>
      <div class="content text-center">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius sapiente
        in error, animi nostrum ut suscipit corrupti voluptas, doloribus facilis
        et illo assumenda est alias autem! Iure nostrum dolores asperiores?
      </div>
    </header>
    <main>
      <BlogList></BlogList>
      <PdfViewer></PdfViewer>
      <BlogForm v-if="formData.admin"></BlogForm>
      <Footer></Footer>
    </main>
  </div>
</template>

<style scoped>
.heroimage {
  height: 450px;
  overflow: hidden;
}

header .content {
  background-color: rgba(31, 68, 95);
  font-size: 1.5rem;
  color: #fff;
  padding: 20px;
}
</style>

<script setup>
import Navigate from '@/components/Navigate.vue';
import Footer from '@/components/Footer.vue';
import HeroSection from '@/components/HeroSection.vue';
import BlogList from '@/components/BlogList.vue';
import PdfViewer from '@/components/PdfViewer.vue';
import BlogForm from '@/components/BlogForm.vue';
import { onMounted, ref, reactive } from 'vue';
import axios from 'axios';

const formData = reactive({
  admin: false,
});

const isAdmin = async () => {
  // Lấy thông tin người dùng từ localStorage
  const userData = JSON.parse(localStorage.getItem('user'));

  if (userData) {
    // Lấy mảng admins từ một hàm bất đồng bộ fetchAdmin
    const admins = await fetchAdmin();

    // Kiểm tra xem có id nào trong admins bằng với userData.id không
    formData.admin = admins.some((admin) => admin.id === userData.id);

    if (formData.admin) {
      console.log('User is an admin');
    } else {
      console.log('User is not an admin');
    }
  } else {
    console.log('No user data found');
  }
};

const fetchAdmin = async () => {
  try {
    const response = await axios.get(`/api/users/admin`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

onMounted(() => {
  isAdmin();
});
</script>
