import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import defaultProfile from "../assets/defaultProfile.webp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CircularProgress from "@mui/material/CircularProgress";
import { clearUnread, markLastMessage } from "../utils/unreadSlice";
import { getSocket } from "../utils/socket";

// ─── Contacts List ────────────────────────────────────────────────────────────
const ContactsList = ({ userMatches, userId, onSelectContact, unreadData }) => {
  const sorted = [...(userMatches || [])].sort((a, b) => {
    const timeA = unreadData[a._id]?.lastTime
      ? new Date(unreadData[a._id].lastTime)
      : 0;
    const timeB = unreadData[b._id]?.lastTime
      ? new Date(unreadData[b._id].lastTime)
      : 0;
    return timeB - timeA;
  });

  return (
    <div className="w-full md:w-80 h-full bg-[#1e0f1a] flex flex-col border-r border-[#3d2438]">
      <div className="px-4 py-5 text-xl font-bold text-[#f0f0f0] border-b border-[#3d2438]">
        Chats
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="text-[#9a8a95] text-sm text-center mt-10 px-4">
            No matches yet. Start connecting!
          </div>
        ) : (
          sorted.map((match) => {
            const unreadCount = unreadData[match._id]?.count || 0;
            const preview =
              unreadData[match._id]?.lastMessage ||
              match.bio?.slice(0, 40) ||
              "Start a conversation!";
            return (
              <div
                key={match._id}
                onClick={() => onSelectContact(match._id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 hover:bg-[#2e1a28] ${userId === match._id ? "bg-[#3d2438]" : ""} ${unreadCount > 0 && userId !== match._id ? "bg-[#2e1a28]" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={match.photos?.[0] || defaultProfile}
                    alt={match.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full border-2 border-[#1e0f1a]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div
                      className={`text-sm truncate ${unreadCount > 0 ? "text-white font-bold" : "text-[#f0f0f0] font-semibold"}`}
                    >
                      {match.firstName + " " + match.lastName}
                    </div>
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 flex-shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-xs truncate ${unreadCount > 0 ? "text-white" : "text-[#9a8a95]"}`}
                  >
                    {preview}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─── Empty Chat ───────────────────────────────────────────────────────────────
const EmptyChat = () => (
  <div className="flex-1 hidden md:flex items-center justify-center bg-[#291424]">
    <div className="text-center text-[#9a8a95]">
      <div className="text-5xl mb-4">💬</div>
      <div className="text-xl font-bold text-[#f0f0f0]">Select a chat</div>
      <div className="text-sm mt-2">
        Choose a match from the left to start chatting
      </div>
    </div>
  </div>
);

// ─── Profile Modal ────────────────────────────────────────────────────────────
const ProfileModal = ({ user, onClose }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartX = useRef(null);

  const photoList = user?.photos?.filter(Boolean).length
    ? user.photos.filter(Boolean)
    : [defaultProfile];

  const handlePrev = (e) => {
    e.stopPropagation();
    setPhotoIndex((p) => (p - 1 + photoList.length) % photoList.length);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setPhotoIndex((p) => (p + 1) % photoList.length);
  };
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setPhotoIndex((p) => (p + 1) % photoList.length);
      else setPhotoIndex((p) => (p - 1 + photoList.length) % photoList.length);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-[#4f404b] text-[#f0f0f0] rounded-2xl shadow-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 40px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto flex flex-col p-2 pb-4">
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all duration-150"
          >
            <CloseIcon fontSize="small" />
          </button>

          {/* Photo carousel */}
          <div
            className="relative h-70 w-full overflow-hidden rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {!imageLoaded && (
              <div className="w-full h-full rounded-xl bg-[#726f71] flex items-center justify-center absolute inset-0 z-10">
                <CircularProgress style={{ color: "white" }} />
              </div>
            )}
            <div
              className="flex h-full"
              style={{
                width: `${photoList.length * 100}%`,
                transform: `translateX(-${(photoIndex * 100) / photoList.length}%)`,
                transition: "transform 0.4s ease-in-out",
              }}
            >
              {photoList.map((photo, i) => (
                <div
                  key={i}
                  className="h-full flex-shrink-0"
                  style={{ width: `${100 / photoList.length}%` }}
                >
                  <img
                    src={photo}
                    alt={`Photo ${i + 1}`}
                    className="object-cover w-full h-full rounded-xl"
                    onLoad={() => {
                      if (i === 0) setImageLoaded(true);
                    }}
                  />
                </div>
              ))}
            </div>

            {photoList.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {photoList.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === photoIndex ? "bg-white scale-125" : "bg-white/40"}`}
                  />
                ))}
              </div>
            )}

            {photoList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className={`hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-0.5 transition-all duration-200 z-10 ${isHovered ? "opacity-100" : "opacity-0"}`}
                >
                  <ChevronLeftIcon fontSize="small" />
                </button>
                <button
                  onClick={handleNext}
                  className={`hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-0.5 transition-all duration-200 z-10 ${isHovered ? "opacity-100" : "opacity-0"}`}
                >
                  <ChevronRightIcon fontSize="small" />
                </button>
              </>
            )}
          </div>

          {/* Details */}
          <div className="pt-4 pb-2 px-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {user.firstName + " " + user.lastName}
                {user.age ? ", " + user.age : ""}
              </h2>
              <span className="text-sm">{user.gender}</span>
            </div>
            {user.bio && (
              <p className="text-sm bg-[#4a3845] rounded-xl py-1 px-2">
                {user.bio}
              </p>
            )}
            {user.userLocation && (
              <div className="text-sm text-[#acabac] bg-[#4a3845] rounded-xl py-1 px-2">
                <LocationOnIcon fontSize="small" className="pb-1" />
                <span>{user.userLocation}</span>
              </div>
            )}
            {user.skills && (
              <div className="bg-[#4a3845] rounded-xl py-1 px-2">
                <div className="font-bold text-sm">My professional skills:</div>
                <span className="text-xs">{user.skills}</span>
              </div>
            )}
            {user.hobbies && (
              <div className="bg-[#4a3845] rounded-xl py-1 px-2">
                <div className="font-bold text-sm">My hobbies beyond work:</div>
                <span className="text-xs">{user.hobbies}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Icebreaker Suggestions ───────────────────────────────────────────────────
const IcebreakerSuggestions = ({ activeChatUser, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchIcebreakers = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        BASE_URL + "/ai/icebreaker",
        {
          targetFirstName: activeChatUser.firstName,
          targetSkills: activeChatUser.skills || "",
          targetHobbies: activeChatUser.hobbies || "",
          targetBio: activeChatUser.bio || "",
        },
        { withCredentials: true },
      );
      setSuggestions(res?.data?.suggestions || []);
      setFetched(true);
    } catch (err) {
      console.error("Icebreaker fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4 gap-3">
      <div className="text-center text-[#9a8a95] text-sm">
        No messages yet. Say hi! 👋
      </div>
      {!fetched ? (
        <button
          onClick={fetchIcebreakers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c084fc] text-[#c084fc] hover:bg-[#c084fc] hover:text-white disabled:opacity-50 transition-all duration-200 text-sm font-medium cursor-pointer mt-2"
        >
          <AutoAwesomeIcon style={{ fontSize: 16 }} />
          {loading ? "Generating ideas..." : "Suggest an opening message"}
        </button>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-1 text-xs text-[#c084fc] mb-1">
            <AutoAwesomeIcon style={{ fontSize: 12 }} />
            <span>AI suggestions — click one to use it</span>
          </div>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSelect(s)}
              className="text-left text-sm text-[#f0f0f0] bg-[#3d2438] hover:bg-[#4b1745] px-4 py-2 rounded-2xl transition-all duration-150 cursor-pointer"
            >
              {s}
            </button>
          ))}
          <button
            onClick={fetchIcebreakers}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#3d2438] text-[#9a8a95] hover:border-[#c084fc] hover:text-[#c084fc] disabled:opacity-50 transition-all duration-200 text-xs cursor-pointer mt-1"
          >
            <AutoAwesomeIcon style={{ fontSize: 12 }} />
            {loading ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Chat Window ──────────────────────────────────────────────────────────────
const ChatWindow = ({
  activeChatUser,
  messages,
  text,
  setText,
  onSend,
  onBack,
  loggedInUser,
  messagesEndRef,
  onShowProfile,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#291424] overflow-hidden">
      {/* ── header — click to view profile ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1e0f1a] border-b border-[#3d2438] flex-shrink-0">
        <button
          onClick={onBack}
          className="md:hidden text-[#b5b3b3] hover:text-white"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        {activeChatUser && (
          <div
            className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity duration-150"
            onClick={onShowProfile}
          >
            <img
              src={activeChatUser.photos?.[0] || defaultProfile}
              alt={activeChatUser.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-[#f0f0f0] font-semibold">
                {activeChatUser.firstName + " " + activeChatUser.lastName}
              </div>
              <div className="text-xs text-[#9a8a95]">
                {activeChatUser.userLocation || "Tap to view profile"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.length === 0 && activeChatUser ? (
          <IcebreakerSuggestions
            activeChatUser={activeChatUser}
            onSelect={(s) => setText(s)}
          />
        ) : (
          messages.map((msg) => {
            const isMe =
              msg.senderId === loggedInUser?._id ||
              msg.senderId?.toString() === loggedInUser?._id?.toString();
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-[#4b1745] text-white rounded-br-sm" : "bg-[#4f404b] text-[#f0f0f0] rounded-bl-sm"}`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${isMe ? "text-[#c9a0c4]" : "text-[#9a8a95]"}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="px-4 py-3 bg-[#1e0f1a] border-t border-[#3d2438] flex items-center gap-3 flex-shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-[#3d2438] text-[#f0f0f0] placeholder-[#9a8a95] rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={onSend}
          disabled={!text.trim()}
          className="bg-[#4b1745] hover:bg-[#6b2465] disabled:opacity-40 text-white rounded-full p-2 transition-all duration-150"
        >
          <SendIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Chat Component ──────────────────────────────────────────────────────
const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.user);
  const userMatches = useSelector((store) => store.matches);
  const unreadData = useSelector((store) => store.unread) || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [isMobileContactsOpen, setIsMobileContactsOpen] = useState(!userId);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const messagesEndRef = useRef(null);
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (userId && userMatches) {
      const match = userMatches.find((m) => m._id === userId);
      if (match) setActiveChatUser(match);
    }
  }, [userId, userMatches]);

  useEffect(() => {
    if (!userId) return;
    setIsMobileContactsOpen(false);
    dispatch(clearUnread(userId));
    api
      .patch(BASE_URL + "/chat/seen/" + userId, {}, { withCredentials: true })
      .catch((err) => console.log("Failed to mark as seen", err));
  }, [userId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }, 50);
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages.length]);

  useEffect(() => {
    if (!userId || !loggedInUser) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get(BASE_URL + "/chat/" + userId, {
          withCredentials: true,
        });
        setMessages(res?.data?.data || []);
        scrollToBottom();
      } catch (err) {
        console.log("Failed to fetch chat history", err);
      }
    };
    fetchHistory();

    const socket = getSocket();
    socket.emit("joinChat", { targetUserId: userId });

    const handleMessage = (message) => {
      const senderId = message.senderId?.toString();
      const receiverId = message.receiverId?.toString();
      const currentUserId = userIdRef.current;
      const myId = loggedInUser._id?.toString();

      const belongsToThisChat =
        (senderId === currentUserId && receiverId === myId) ||
        (senderId === myId && receiverId === currentUserId);

      if (belongsToThisChat) {
        setMessages((prev) => [...prev, message]);
        const otherUserId = senderId === myId ? receiverId : senderId;
        dispatch(
          markLastMessage({
            userId: otherUserId,
            text: message.text,
            time: message.createdAt,
          }),
        );
        if (senderId !== myId) {
          api
            .patch(
              BASE_URL + "/chat/seen/" + senderId,
              {},
              { withCredentials: true },
            )
            .catch(() => {});
        }
      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [userId, loggedInUser]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit("sendMessage", { targetUserId: userId, text });
    setText("");
  };

  const handleSelectContact = (matchId) => navigate("/chat/" + matchId);

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ── Profile Modal ── */}
      {showProfileModal && activeChatUser && (
        <ProfileModal
          user={activeChatUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* mobile */}
      <div className="flex w-full md:hidden h-full">
        {isMobileContactsOpen ? (
          <ContactsList
            userMatches={userMatches}
            userId={userId}
            onSelectContact={handleSelectContact}
            unreadData={unreadData}
          />
        ) : (
          <ChatWindow
            activeChatUser={activeChatUser}
            messages={messages}
            text={text}
            setText={setText}
            onSend={sendMessage}
            onBack={() => setIsMobileContactsOpen(true)}
            loggedInUser={loggedInUser}
            messagesEndRef={messagesEndRef}
            onShowProfile={() => setShowProfileModal(true)}
          />
        )}
      </div>

      {/* desktop */}
      <div className="hidden md:flex w-full h-full">
        <ContactsList
          userMatches={userMatches}
          userId={userId}
          onSelectContact={handleSelectContact}
          unreadData={unreadData}
        />
        {userId ? (
          <ChatWindow
            activeChatUser={activeChatUser}
            messages={messages}
            text={text}
            setText={setText}
            onSend={sendMessage}
            onBack={() => setIsMobileContactsOpen(true)}
            loggedInUser={loggedInUser}
            messagesEndRef={messagesEndRef}
            onShowProfile={() => setShowProfileModal(true)}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default Chat;
