<template>
  <div class="blog_list">
    <div class="container">
      <h1 class="mx-3">Our Blogs</h1>
      <div class="row">
        <div
          v-for="blog in pagedBlogs"
          :key="blog.id"
          class="col-xl-3 col-md-6 col-lg-4"
        >
          <div class="blog_card">
            <Actical_card
              :image="blog.imageurl"
              :title="blog.title"
              :description="blog.contentintro.slice(0, 100) + '...'"
              :author="blog.author"
              :authoravatar="blog.authoravatar"
              :views="blog.views"
              :id="blog.postid"
              :create_at="blog.createdat"
            ></Actical_card>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click="changePage(currentPage - 1, $event)"
              >Previous</a
            >
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click="changePage(page, $event)">{{
              page
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click="changePage(currentPage + 1, $event)"
              >Next</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import api from '@/axios';
import Actical_card from './Actical_card.vue';

const blogs = ref([]); // Tất cả bài viết
const currentPage = ref(1); // Trang hiện tại
const formData = reactive({
  admin: false,
  itemsPerPage: 8,
});

// Khai báo biến itemsPerPage

// Hàm cập nhật giá trị itemsPerPage theo kích thước màn hình
function updateItemsPerPage() {
  const screenWidth = window.innerWidth;

  if (screenWidth > 1200) {
    formData.itemsPerPage = 8; // Màn hình lớn
  } else if (screenWidth > 768) {
    formData.itemsPerPage = 4; // Màn hình trung bình
  } else {
    formData.itemsPerPage = 3; // Màn hình nhỏ
  }
}

// Loại bỏ sự kiện khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage);
});
// Lấy danh sách blog từ API khi component được mounted
onMounted(() => {
  fetchBlog();
  isAdmin();
  updateItemsPerPage(); // Gọi hàm lần đầu khi component được mount
  window.addEventListener('resize', updateItemsPerPage);
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
    const response = await api.get(`/api/users/admin`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

// Tính toán số trang
const totalPages = computed(() => {
  return Math.ceil(blogs.value.length / formData.itemsPerPage);
});

// Lọc các bài blog hiển thị trên trang hiện tại
const pagedBlogs = computed(() => {
  const startIndex = (currentPage.value - 1) * formData.itemsPerPage;
  const endIndex = startIndex + formData.itemsPerPage;
  return blogs.value.slice(startIndex, endIndex);
});

// Thay đổi trang
const changePage = (page, event) => {
  event.preventDefault(); // Ngừng cuộn lên đầu trang
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const fetchBlog = async () => {
  try {
    await api
      .get('/api/posts', {
        params: { category_name: 'blog' },
      })
      .then((response) => {
        blogs.value = response.data; // Gán dữ liệu vào blogs
        console.log(blogs.value);
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
      });
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
};
</script>

<style scoped>
.blog_list {
  background-color: #4f92bf;
  padding: 20px 0;
  margin-left: auto;
  margin-right: auto;
}

.blog_card {
  position: relative;
}

.blog_card button {
  position: absolute;
  top: 0;
  right: 8px;
  background-color: #fff;
}

.blog_card button i {
  padding: 2px;
}
</style>
