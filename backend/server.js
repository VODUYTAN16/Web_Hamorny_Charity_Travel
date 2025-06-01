import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

// Cấu hình CORS và Express
app.use(cors());

app.use(
  cors({
    origin: 'http://localhost:5173', // Cho phép yêu cầu từ front-end trên cổng 5173
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức HTTP này
    allowedHeaders: ['Content-Type'], // Các headers được phép
  })
);

app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Kết nối MySQL
const db = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',
  // password: process.env.PASSWORD_MYSQL, // Thay bằng mật khẩu của bạn
  // database: 'blog_db', // Tên database
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL');
  }
});

// API tìm bài viết mới nhất
app.get('/api/posts/related', (req, res) => {
  const query = `
    SELECT posts.id, posts.created_at, posts.views, 
           users.username AS author, users.image_avatar AS authorAvatar, categories.name AS category,
           post_content.title, post_content.subtitle, post_content.content_intro, post_content.quote, post_content.content_body, post_content.image_url
    FROM posts
    INNER JOIN users ON posts.author_id = users.id
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN post_content ON posts.id = post_content.post_id
    WHERE categories.name = 'blog'
    ORDER BY posts.created_at DESC
    LIMIT 3`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching related posts:', err);
      res.status(500).json({ message: 'Error fetching related posts' });
    } else {
      res.json(results);
    }
  });
});

// API lấy danh sách bài viết (kết hợp posts và post_content)
// app.get('/api/posts', (req, res) => {
//   const query = `SELECT posts.id, posts.created_at, posts.views,
//            users.username AS author, users.image_avatar AS authorAvatar, categories.name AS category,
//            post_content.title, post_content.subtitle, post_content.content_intro, post_content.quote, post_content.content_body, post_content.image_url
//     FROM posts
//     INNER JOIN users ON posts.author_id = users.id
//     INNER JOIN categories ON posts.category_id = categories.id
//     INNER JOIN post_content ON posts.id = post_content.post_id
//     ORDER BY posts.created_at DESC;`;
//   db.query(query, (err, results) => {
//     if (err) {
//       res.status(500).json({ message: 'Error retrieving posts' });
//     } else {
//       res.json(results);
//     }
//   });
// });

app.get('/api/posts', (req, res) => {
  const category_name = req.query.category_name; // Lấy category_id từ tham số query
  // Xây dựng phần WHERE trong câu truy vấn
  let query = `SELECT posts.id, posts.created_at, posts.views, 
           users.username AS author, users.image_avatar AS authorAvatar, categories.name AS category,
           post_content.title, post_content.subtitle, post_content.content_intro, post_content.quote, post_content.content_body, post_content.link, post_content.image_url, post_content.id as post_content_id
    FROM posts
    INNER JOIN users ON posts.author_id = users.id
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN post_content ON posts.id = post_content.post_id`;

  // Nếu có category_id, thêm điều kiện WHERE vào câu truy vấn
  if (category_name) {
    query += ` WHERE categories.name = ?`;
  } else {
    query += ` WHERE categories.name = 'blog'`;
  }

  query += ` ORDER BY posts.created_at DESC;`; // Sắp xếp theo thời gian tạo mới nhất

  // Thực thi truy vấn
  db.query(query, [category_name], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving posts' });
    } else {
      res.json(results);
    }
  });
});

// API để xóa bài đăng và nội dung bài đăng
app.delete('/api/posts/:postId/contents/:postContentId', (req, res) => {
  const { postId, postContentId } = req.params;

  // Kiểm tra sự tồn tại của bài đăng và nội dung bài đăng
  const checkQuery = `
    SELECT * FROM posts 
    INNER JOIN post_content ON posts.id = post_content.post_id 
    WHERE posts.id = ? AND post_content.id = ?
  `;

  db.query(checkQuery, [postId, postContentId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Error checking post and content',
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Post or content not found' });
    }

    // Xóa nội dung bài đăng
    const deleteContentQuery = 'DELETE FROM post_content WHERE id = ?';
    db.query(deleteContentQuery, [postContentId], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error deleting post content', error: err.message });
      }

      // Xóa bài đăng nếu không còn nội dung nào liên kết
      const checkRemainingContentsQuery =
        'SELECT * FROM post_content WHERE post_id = ?';
      db.query(
        checkRemainingContentsQuery,
        [postId],
        (err, remainingContents) => {
          if (err) {
            return res.status(500).json({
              message: 'Error checking remaining content',
              error: err.message,
            });
          }

          if (remainingContents.length === 0) {
            const deletePostQuery = 'DELETE FROM posts WHERE id = ?';
            db.query(deletePostQuery, [postId], (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: 'Error deleting post', error: err.message });
              }

              return res
                .status(200)
                .json({ message: 'Post and content deleted successfully' });
            });
          } else {
            return res.status(200).json({
              message: 'Content deleted successfully, post still exists',
            });
          }
        }
      );
    });
  });
});

// API lấy chi tiết bài viết theo ID (posts và post_content)
app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  const query = `
    SELECT posts.id, posts.created_at, posts.views, users.id AS user_id,
           users.username AS author, users.image_avatar AS authorAvatar, categories.name AS category,
           post_content.title, post_content.subtitle, post_content.content_intro, post_content.quote, post_content.content_body, post_content.image_url
    FROM posts
    INNER JOIN users ON posts.author_id = users.id
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN post_content ON posts.id = post_content.post_id
    WHERE posts.id = ?`;
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.log('Error retrieving blog post');
      res.status(500).json({ message: 'Error retrieving blog post' });
    } else if (results.length === 0) {
      console.log('Post not found');
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// API đăng bài viết mới (posts và post_content)
app.post('/api/posts', (req, res) => {
  const {
    author_id,
    category_id,
    image_url,
    title,
    subtitle,
    content_intro,
    quote,
    content_body,
    link,
  } = req.body;

  // Thêm vào bảng posts
  const insertPostQuery = `
    INSERT INTO posts (author_id, category_id)
    VALUES (?, ?)
  `;

  db.query(insertPostQuery, [author_id, category_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating post' });
    }

    const postId = result.insertId;

    // Thêm chi tiết bài viết vào bảng post_content
    const insertContentQuery = `
      INSERT INTO post_content (post_id, title, subtitle, content_intro, quote, content_body, image_url, link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertContentQuery,
      [
        postId,
        title,
        subtitle,
        content_intro,
        quote,
        content_body,
        image_url,
        link,
      ],
      (err) => {
        if (err) {
          res.status(500).json({ message: 'Error creating post content' });
        } else {
          res.status(201).json({
            message: 'Post created successfully',
            postId: postId,
          });
        }
      }
    );
  });
});

// API lấy danh sách admin
app.get('/api/users/admin', (req, res) => {
  const query = `SELECT * from users where role = 'admin'`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving categories' });
    } else {
      res.json(results);
    }
  });
});
// API lấy danh sách danh mục
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving categories' });
    } else {
      res.json(results);
    }
  });
});

// API thêm danh mục mới
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  const query = `
    INSERT INTO categories (name)
    VALUES (?)
  `;
  db.query(query, [name], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error creating category' });
    } else {
      res.status(201).json({
        message: 'Category created successfully',
        categoryId: result.insertId,
      });
    }
  });
});

// API lấy danh sách bình luận cho bài viết
app.get('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const query = `
    SELECT 
      comments.id, 
      comments.content, 
      comments.author_id, 
      comments.created_at,
      users.image_avatar AS author_avatar,
      users.username as name
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = ?
  `;
  db.query(query, [postId], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving comments' });
    } else {
      res.json(results);
    }
  });
});

// API thêm bình luận cho bài viết
app.post('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { author_name, content, email } = req.body;

  // Truy vấn để lấy author_id từ bảng users dựa trên email
  const getUserQuery = 'SELECT id FROM users WHERE email = ?';

  db.query(getUserQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Lấy author_id từ kết quả truy vấn
    const author_id = result[0].id;

    // Tiến hành chèn bình luận vào bảng comments
    const insertCommentQuery =
      'INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)';

    db.query(
      insertCommentQuery,
      [postId, author_id, content],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating comment' });
        }

        res.status(201).json({
          message: 'Comment created successfully',
          commentId: result.insertId,
        });
      }
    );
  });
});

//API xóa comment
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  const { author_id } = req.body; // Lấy `author_id` từ body của request

  // Truy vấn để xóa bình luận dựa trên `author_id`, `post_id` và `id`
  const deleteCommentQuery =
    'DELETE FROM comments WHERE id = ? AND post_id = ? AND author_id = ?';

  db.query(
    deleteCommentQuery,
    [commentId, postId, author_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting comment' });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: 'Comment not found or unauthorized' });
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    }
  );
});

// API đếm số comment của bài viết
app.get('/api/comments/:postId', (req, res) => {
  const postId = req.params.postId;

  if (postId == undefined) {
    return res.status(400).json({ message: 'PostId is required' });
  }

  const query = `SELECT COUNT(*) as count FROM comments Where post_id = ?`;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error checking like status' });
    }

    if (results) {
      return res.status(200).json(results[0].count);
    }
  });
});

// API tăng/giảm lượt thích
app.post('/api/posts/:id/like', (req, res) => {
  const postId = req.params.id; // ID bài viết
  const { userId, action } = req.body; // ID người dùng và hành động ('like' hoặc 'unlike')

  if (!['like', 'unlike'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  // Thực hiện thêm hoặc xóa bản ghi trong bảng user_likes
  if (action === 'like') {
    const addLikeQuery = `
        INSERT INTO user_likes (user_id, post_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE id=id; -- Đảm bảo không thêm trùng lặp
      `;
    db.query(addLikeQuery, [userId, postId], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error adding to user_likes' });
      }
      return res.status(200).json({ message: 'Post liked successfully' });
    });
  } else if (action === 'unlike') {
    const removeLikeQuery = `
        DELETE FROM user_likes
        WHERE user_id = ? AND post_id = ?
      `;
    db.query(removeLikeQuery, [userId, postId], (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: 'Error removing from user_likes' });
      }
      return res.status(200).json({ message: 'Post unliked successfully' });
    });
  }
});

//API đếm số lượt like của bài viết
app.get('/api/user_likes/:postId', (req, res) => {
  const postId = req.params.postId;

  if (postId == undefined) {
    return res.status(400).json({ message: 'PostId is required' });
  }

  const query = `SELECT COUNT(*) as count FROM user_likes Where post_id = ?`;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error checking like status' });
    }

    if (results) {
      return res.status(200).json(results[0].count);
    }
  });
});

// API kiểm tra người dùng đã like bài viết hay chưa
app.get('/api/posts/:userId/is-liked/:postId', (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  if (userId === undefined || userId == null) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = `
    SELECT *
    FROM user_likes
    WHERE user_id = ? AND post_id = ?
  `;

  db.query(query, [userId, postId], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error checking like status' });
    }

    if (results.length === 0) {
      return res.status(200).json({ isLiked: false });
    } else {
      return res.status(200).json({ isLiked: true });
    }
  });
});

// API đăng nhập bằng google
app.post('/api/google-login', (req, res) => {
  const { email, name, image_avatar } = req.body;

  // Kiểm tra xem user đã tồn tại chưa
  const queryCheck = 'SELECT * FROM users WHERE email = ?';
  db.query(queryCheck, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Ghi lại lỗi cơ sở dữ liệu
      return res
        .status(500)
        .json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
    }
    if (results.length > 0) {
      // Nếu user đã tồn tại, trả về thông tin
      res
        .status(200)
        .json({ message: 'Đăng nhập thành công!', user: results[0] });
    } else {
      // Nếu chưa tồn tại, thêm user vào database
      const queryInsert =
        'INSERT INTO users (username, email, image_avatar) VALUES (?, ?, ?)';
      db.query(queryInsert, [name, email, image_avatar], (err, result) => {
        if (err) throw err;
        // Lấy id của user vừa thêm
        const queryGetId = result.insertId;
        res.status(201).json({
          message: 'Tạo tài khoản mới và đăng nhập thành công!',
          user: {
            id: queryGetId,
            username: name,
            email: email,
            role: 'user',
            image_avatar: image_avatar,
          },
        });
      });
    }
  });
});

// API đăng ký (Register)
app.post('/api/register', async (req, res) => {
  const { email, password, name, image_avatar } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Database error', error: err.message });
      }

      if (results.length > 0) {
        // Nếu email đã tồn tại
        return res.status(400).json({
          message: "This Account is already, let's Sign In",
        });
      }

      // Nếu email chưa tồn tại, tiến hành tạo tài khoản
      db.query(
        `INSERT INTO users (email, password, username, image_avatar) VALUE (?, ?, ?, ?)`,
        [email, password, name, image_avatar],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: 'Database error', error: err.message });
          }

          const queryGetId = result.insertId;

          res.status(201).json({
            message: 'Account created successfully',
            user: {
              id: queryGetId,
              username: name,
              email: email,
              role: 'user',
              image_avatar: image_avatar,
            },
          });
        }
      );
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error creating user', error: error.message });
  }
});

// API đăng nhập (Login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Database error', error: err.message });
        }

        if (results.length === 0) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Kiểm tra mật khẩu
        const isPasswordValid = password == user.password;
        if (!isPasswordValid) {
          return res.status(400).json({
            message:
              "Invalid email or password or you register by google before, Let's login by google",
          });
        }

        // Tạo token JWT
        // const token = jwt.sign(
        //   { id: user.id, email: user.email, role: user.role },
        //   secretKey,
        //   { expiresIn: '1h' } // Thời gian hết hạn token
        // );

        res.status(200).json({
          message: 'Login successful',
          user: results[0],
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// API Proxy để tải file PDF từ Google Drive
app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;

    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Đặt tiêu đề Content-Type để trình duyệt biết đây là file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // Hiển thị trực tiếp
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching PDF:', error.message);
    res.status(500).send('Error fetching PDF');
  }
});

// Khởi động server
app.listen(process.env.MYSQLPORT, () => {
  console.log(
    `Server running on http://${process.env.MYSQLHOST}:${process.env.MYSQLPORT}`
  );
});
