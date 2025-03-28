import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, Repeat2, Bookmark, X, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import postsService from "@/actions/post.action";
import commentsService, { Comment } from "@/actions/comment.action";
import authService from "@/actions/user.action";
import MenuSection from "@/components/menu/menu";
import { toast } from "sonner";

interface Post {
  id: string;
  text: string;
  image?: string;
  date: string;
  users?: {
    username: string;
    profile_picture: string;
  };
  likes?: { count: number }[];
  comments?: { count: number }[];
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [showComments, setShowComments] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const postsResponse = await postsService.getUserBookmarkedPosts();
        console.log('Bookmarked posts',postsResponse.data);
        if (postsResponse) {
          setPosts(postsResponse.data);
        }
        
        // Fetch liked posts
        const likedResponse = await postsService.getUserLikedPosts();
        console.log('User liked posts',likedResponse);
        if (likedResponse.data) {
          const likedMap = likedResponse.data.reduce<{ [key: string]: boolean }>(
            (acc, post) => {
              acc[post.post_id] = true;
              return acc;
            },
            {}
          );
          setLikedPosts(likedMap);
        }

        // Fetch bookmarked posts
        const bookmarkedResponse = await postsService.getUserBookmarkedPosts();
        if (bookmarkedResponse?.data) {
          const bookmarkedMap = bookmarkedResponse.data.reduce<{ [key: string]: boolean }>(
            (acc, post) => {
              acc[post.post_id] = true;
              return acc;
            },
            {}
          );
          setBookmarkedPosts(bookmarkedMap);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();

    const fetchUserId = async () => {
      try {
        const userResponse = await authService.getUser();
        console.log('User response: ',userResponse);
        if (userResponse?.user) {
          setUserId(userResponse.user.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
     
    fetchUserId();
    const fetchLikedComments = async () => {
      try {
        const likedCommentsResponse = await commentsService.getUserLikedComments();
        console.log('Liked comments: ',likedCommentsResponse);
        if (likedCommentsResponse) {
          const likedCommentsMap = likedCommentsResponse.reduce<{
            [key: string]: boolean;
          }>((acc, commentId) => {
            acc[commentId] = true;
            return acc;
          }, {});
          setLikedComments(likedCommentsMap);
        }
      } catch (error) {
        console.error("Error fetching liked comments:", error);
      }
    };
    fetchLikedComments();
  }, []);

  
  const formatRelativeDate = (isoDate: number) => {
    const date = new Date(isoDate);
    const now = new Date();
  
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (diffInSeconds < 60 * 60 * 24) {
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tashkent',
      };
      const formattedDate = new Intl.DateTimeFormat('uz-UZ', options).format(date);
      const [hour, minute] = formattedDate.split(':');
      const newHour = parseInt(hour) + 5;
      const newMinute = minute;
      return `${newHour.toString().padStart(2, '0')}:${newMinute}`;
    } else if (diffInSeconds < 60 * 60 * 48) {

      return "yesterday";
    } else {

      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      return new Intl.DateTimeFormat('uz-UZ', options).format(date);
    }
  };

  const openComments = async (postId: string) => {
    setActivePostId(postId);
    try {
      const commentsResponse = await commentsService.getComments(postId);
      console.log('Comments response: ',commentsResponse);
      if (commentsResponse) {
        setComments((prev) => ({
          ...prev,
          [postId]: commentsResponse,
        }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setShowComments(true);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      if (likedPosts[postId]) {
        await postsService.unlikePost(postId);
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
      } else {
        await postsService.likePost(postId);
      }
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      toast.error("Failed to like/unlike post");
    }
  };

  const toggleBookmark = async (postId: string) => {
    try {
      if (bookmarkedPosts[postId]) {
        await postsService.removeBookmark(postId);
      } else {
        await postsService.addBookmark(postId);
      }
      setBookmarkedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (error) {
      console.error("Error bookmarking/unbookmarking post:", error);
      toast.error("Failed to bookmark/unbookmark post");
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      if (likedComments[commentId]) {
        await commentsService.unlikeComment(commentId);
      } else {
        await commentsService.likeComment(commentId);
      }
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      if (activePostId) await openComments(activePostId);
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      toast.error("Failed to like/unlike comment");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activePostId || isSubmitting || !userId) return;

    setIsSubmitting(true);
    try {
      await commentsService.createComment({ 
        post_id: activePostId, 
        text: newComment, 
        user_id: userId 
      });
      setNewComment("");
      await openComments(activePostId);
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingCommentId || !activePostId || !userId) return;

    try {
      await commentsService.updateComment(editingCommentId, {
        post_id: activePostId,
        text: editCommentText,
        user_id: userId
      });
      
      await openComments(activePostId);
      setEditingCommentId(null);
      setEditCommentText("");
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!activePostId) return;

    try {
      await commentsService.deleteComment(commentId);
      await openComments(activePostId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const renderCommentsModal = () => {
    if (!showComments || !activePostId) return null;

    const postComments = comments[activePostId] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comments ({postComments.length})
            </h3>
            <button 
              onClick={() => {
                setShowComments(false);
                setActivePostId(null);
              }} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {postComments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              postComments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={comment.users?.profile_picture || ''}
                        alt={comment.users?.username || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-sm">
                          {comment.users?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeDate(comment.date)}
                        </p>
                      </div>
                    </div>

                    {comment.user_id === userId && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditCommentText(comment.text);
                          }}
                          className="text-blue"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button 
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentText("");
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditComment}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
                  )}

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <button 
                      onClick={() => likeComment(comment.id)}
                      className="flex items-center space-x-1"
                    >
                      <Heart 
                        size={16} 
                        className={`
                          ${
                            likedComments[comment.id] 
                              ? 'text-red fill-red' 
                              : 'text-gray-500'
                          }
                        `} 
                      />
                      <span>{comment.comment_likes?.[0]?.count || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border rounded dark:bg-gray-700"
                rows={3}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div>
    <div className="space-y-4 relative">
      {posts.length === 0 ? (
        <div className="flex flex-col gap-4 items-center">
        <div className="text-gray-500 mt-20 text-center">No posts found.</div>
        <Link className="px-4 py-2 mx-auto bg-blue rounded-full" href="/posts"> <a>Go to posts page</a></Link>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <h1 className="text-lg">Bookmarked Posts</h1>
        {posts.map((post) => (
          <div key={post.id} className="post-card sm:mx-60 sm:mt-8 sm:my-24 text-black dark:text-white animate-slide-up">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={post.posts?.users.profile_picture || '/default-avatar.png'}
                  alt={`User ${post.users?.username}`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{post.posts.users?.username}</h3>
                  <span className="text-gray text-sm">{formatRelativeDate(post.posts.date)}</span>
                </div>
                <p className="mb-4">{post.posts.text}</p>

                {post.posts.image && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <Image
                      width={300}
                      height={300}
                      src={post.posts?.image}
                      alt="Post content"
                      className="w-full h-auto object-cover rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                    />
                  </div>
                )}

                <div className="flex justify-between text-gray">
                  <button 
                    className="flex items-center gap-1 group" 
                    onClick={() => toggleLike(post.posts.id)}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        likedPosts[post.posts.id] ? "text-red fill-red" : ""
                      }`}
                    />
                    <span>{post.posts.likes?.[0]?.count ?? 0}</span>
                  </button>

                  <button
                    className="flex items-center gap-1 group"
                    onClick={() => openComments(post.post_id)}
                  >
                    <MessageCircle className="h-5 w-5 group-hover:text-blue transition-colors" />
                    <span>{post.posts.comments?.[0]?.count ?? 0}</span>
                  </button>

                  <button className="flex items-center gap-1 group">
                    <Repeat2 className="h-5 w-5 group-hover:text-green transition-colors" />
                    <span>0</span>
                  </button>

                  <button
                    className="flex items-center gap-1 group"
                    onClick={() => toggleBookmark(post.post_id)}
                  >
                    <Bookmark
                      className={`h-5 w-5 transition-colors ${
                        bookmarkedPosts[post.post_id] ? "text-blue fill-blue" : ""
                      }`}
                    />
                    <span>Save</span>
                  </button>

                  <button className="flex items-center gap-1 group">
                    <Share2 className="h-5 w-5 group-hover:text-blue transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {renderCommentsModal()}


    </div>
    <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
        <MenuSection />
      </div>
    </div>
  );
};

export default Posts;