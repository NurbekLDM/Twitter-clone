import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, Repeat2, Bookmark, X } from "lucide-react";
import Image from "next/image";
import postsService from "@/actions/post.action";
import commentsService from "@/actions/comment.action";
import authService from "@/actions/user.action";
import { toast } from "sonner";

const Posts: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
    const [bookmarkedPosts, setBookmarkedPosts] = useState<{ [key: string]: boolean }>({});
    const [comments, setComments] = useState<{ [key: string]: unknown[] }>({});
    const [showComments, setShowComments] = useState(false);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [likedComments, setLikedComments] = useState<{ [key: string]: boolean }>({});

    const openComments = async (postId: string) => {
        setActivePostId(postId);
        try {
            const commentsResponse = await commentsService.getComments(postId);
            console.log("Comments:", commentsResponse);
            if (commentsResponse) {
                setComments((prev) => ({
                    ...prev,
                    [postId]: commentsResponse as unknown as unknown[]
                }));
            }
            setShowComments(true);
            const likedCommentsResponse = await commentsService.getUserLikedComments();
            if (likedCommentsResponse && likedCommentsResponse.data) {
                const likedCommentsMap = Array.isArray(likedCommentsResponse.data) ? likedCommentsResponse.data.reduce((acc, comment) => {
                    acc[comment.comment_id] = true;
                    return acc;
                }, {}) : {};
                setLikedComments(likedCommentsMap);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const likeComment = async (commentId: string) => {
        try {
            if (likedComments[commentId]) {
                await commentsService.unlikeComment(commentId);
                setLikedComments((prev) => {
                    const updatedLikes = { ...prev };
                    delete updatedLikes[commentId];
                    return updatedLikes;
                });
            } else {
                await commentsService.likeComment(commentId);
                setLikedComments((prev) => ({
                    ...prev,
                    [commentId]: true,
                }));
            }
        } catch (error) {
            console.error("Error liking/unliking comment:", error);
        }
    };

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await postsService.getPosts();
                console.log("Posts:", response);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setPosts(Array.isArray(response.data) ? response.data : [] as any[]);

                const likedResponse = await postsService.getUserLikedPosts();
                if (likedResponse && likedResponse.data) {
                    const likedMap = Array.isArray(likedResponse.data) ? likedResponse.data.reduce((acc, post) => {
                        acc[post.post_id] = true;
                        return acc;
                    }, {} as { [key: string]: boolean });
                    setLikedPosts(likedMap);
                }

                const bookmarkedResponse = await postsService.getUserBookMarkedPosts();
                if (bookmarkedResponse && bookmarkedResponse.data) {
                    const bookmarkedMap = bookmarkedResponse.data.reduce((acc, post) => {
                        acc[post.post_id] = true;
                        return acc;
                    }, {});
                    setBookmarkedPosts(bookmarkedMap);
                }

                // Fetch user liked comments
                const likedCommentsResponse = await commentsService.getUserLikedComments();
                if (likedCommentsResponse && likedCommentsResponse.data) {
                    const likedCommentsMap = likedCommentsResponse.data.reduce((acc, comment) => {
                        acc[comment.comment_id] = true;
                        return acc;
                    }, {});
                    setLikedComments(likedCommentsMap);
                }

            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        const getUser = async () => {
            try {
                const response = await authService.getUser();
                console.log("User:", response);
                if (response?.user) {
                    setUserId(response.user.id);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        getUser();
        getPosts();
    }, []);

    const toggleLike = async (postId: string) => {
        try {
            if (likedPosts[postId]) {
                await postsService.unlikePost(postId);
                setLikedPosts((prev) => {
                    const updatedLikes = { ...prev };
                    delete updatedLikes[postId];
                    return updatedLikes;
                });
            } else {
                await postsService.likePost(postId);
                setLikedPosts((prev) => ({
                    ...prev,
                    [postId]: true,
                }));
            }
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    const toggleBookmark = async (postId: string) => {
        try {
            if (bookmarkedPosts[postId]) {
                await postsService.unbookmarkPost(postId);
                setBookmarkedPosts((prev) => {
                    const updatedBookmarks = { ...prev };
                    delete updatedBookmarks[postId];
                    return updatedBookmarks;
                });
            } else {
                await postsService.bookmarkPost(postId);
                setBookmarkedPosts((prev) => ({
                    ...prev,
                    [postId]: true,
                }));
            }
        } catch (error) {
            console.error("Error bookmarking/unbookmarking post:", error);
        }
    };

  

    const closeComments = () => {
        setShowComments(false);
        setActivePostId(null);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !activePostId || isSubmitting || !userId) return;

        setIsSubmitting(true);
        try {
            await commentsService.createComment({ post_id: activePostId, comment: newComment, user_id: userId });
            setNewComment("");
            await openComments(activePostId);
            toast("Comment posted successfully", { style: { backgroundColor: "green" } });
            closeComments();
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentsService.deleteComment(commentId);
            await openComments(activePostId);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async (commentId: string, updatedText: string) => {
        try {
            await commentsService.updateComment(commentId, { post_id: activePostId, comment: updatedText });
            await openComments(activePostId);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    if (loading) return <div>Loading posts...</div>;

    function formatRelativeDate(isoDate: string) {
        const date = new Date(isoDate);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);

        if (diffInSeconds < 60) return "recently";
        if (diffInMinutes < 60) return "today";
        if (diffInHours < 24) return "1d";
        if (diffInDays < 7) return `${diffInDays}d`;
        if (diffInWeeks < 4) return `${diffInWeeks}w`;
        if (diffInMonths < 12) return `${diffInMonths}m`;
        return `${diffInYears}y`;
    }

    return (
        <div className="space-y-4 relative">
            {posts.length === 0 ? (
                <div className="text-gray-500 text-center">No posts found.</div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="post-card text-black dark:text-white animate-slide-up">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <Image
                                    src={post.users?.profile_picture}
                                    alt={`User ${post.users?.username}`}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold">{post.users?.username}</h3>
                                    <span className="text-gray text-sm">{formatRelativeDate(post.date)}</span>
                                </div>
                                <p className="mb-4">{post.text}</p>

                                {post.image && (
                                    <div className="mb-4 rounded-xl overflow-hidden">
                                        <Image
                                            width={300}
                                            height={300}
                                            src={post.image}
                                            alt="Post content"
                                            className="w-full h-auto object-cover rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-between text-gray">
                                    <button className="flex items-center gap-1 group" onClick={() => toggleLike(post.id)}>
                                        <Heart className={`h-5 w-5 transition-colors ${likedPosts[post.id] ? "text-red fill-red" : ""}`} />
                                        <span>{post.likes?.[0]?.count ?? 0 + (likedPosts[post.id] ? 1 : 0)}</span>
                                    </button>

                                    <button
                                        className="flex items-center gap-1 group"
                                        onClick={() => openComments(post.id)}
                                    >
                                        <MessageCircle className="h-5 w-5 group-hover:text-blue transition-colors" />
                                        <span>{post.comments?.[0]?.count ?? 0}</span>
                                    </button>

                                    <button className="flex items-center gap-1 group">
                                        <Repeat2 className="h-5 w-5 group-hover:text-green transition-colors" />
                                        <span>0</span>
                                    </button>

                                    <button className="flex items-center gap-1 group" onClick={() => toggleBookmark(post.id)}>
                                        <Bookmark className={`h-5 w-5 transition-colors ${bookmarkedPosts[post.id] ? "text-blue fill-blue" : ""}`} />
                                        <span>Save</span>
                                    </button>

                                    <button className="flex items-center gap-1 group">
                                        <Share2 className="h-5 w-5 group-hover:text-blue transition-colors" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Comments Modal */}
            {showComments && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
                            <button
                                onClick={closeComments}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            {comments[activePostId]?.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-6">No comments yet. Be the first to comment!</p>
                            ) : (
                                <div className="space-y-4">
                                    {comments[activePostId]?.map((comment) => (
                                        <article key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="flex-shrink-0 mr-3">
                                                    <Image
                                                        width={24}
                                                        height={24}
                                                        src={comment.users?.profile_picture || "https://i.pinimg.com/474x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"}
                                                        alt={comment.users?.username}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {comment.users?.username || "User"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatRelativeDate(comment.date)}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center hover:text-blue-600 dark:hover:text-blue-400" onClick={() => likeComment(comment.id)}>
                                                    <Heart className={`h-4 w-4 mr-1 ${likedComments[comment.id] ? "text-red fill-red" : ""}`} />
                                                    {comment.comment_likes?.[0]?.count ?? 0 + (likedComments[comment.id] ? 1 : 0)}
                                                </button>
                                                <span className="mx-2">•</span>
                                                <button className="flex items-center hover:text-blue-600 dark:hover:text-blue-400" onClick={() => handleEditComment(comment.id, prompt("Edit comment:", comment.text) || comment.text)}>
                                                    Edit
                                                </button>
                                                <span className="mx-2">•</span>
                                                <button className="flex items-center hover:text-red-600 dark:hover:text-red-400" onClick={() => handleDeleteComment(comment.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleSubmitComment}>
                                <div className="mb-4">
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        rows={3}
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Posting..." : "Post Comment"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Posts;
