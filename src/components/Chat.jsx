import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import defaultProfile from "../assets/defaultProfile.webp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
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
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 hover:bg-[#2e1a28] ${
                  userId === match._id ? "bg-[#3d2438]" : ""
                } ${unreadCount > 0 && userId !== match._id ? "bg-[#2e1a28]" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={match.photoURL || defaultProfile}
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
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#291424] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1e0f1a] border-b border-[#3d2438] flex-shrink-0">
        <button
          onClick={onBack}
          className="md:hidden text-[#b5b3b3] hover:text-white"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        {activeChatUser && (
          <>
            <img
              src={activeChatUser.photoURL || defaultProfile}
              alt={activeChatUser.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-[#f0f0f0] font-semibold">
                {activeChatUser.firstName + " " + activeChatUser.lastName}
              </div>
              <div className="text-xs text-[#9a8a95]">
                {activeChatUser.userLocation || ""}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="text-center text-[#9a8a95] text-sm mt-10">
            No messages yet. Say hi! 👋
          </div>
        )}
        {messages.map((msg) => {
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
        })}
        <div ref={messagesEndRef} />
      </div>

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

  // mark as seen in DB + clear unread in Redux when opening a chat
  useEffect(() => {
    if (!userId) return;

    setIsMobileContactsOpen(false);
    dispatch(clearUnread(userId));

    // tell the server this conversation has been seen
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
        // if receiving a message while chat is open, mark as seen immediately
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

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [userId, loggedInUser]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit("sendMessage", { targetUserId: userId, text });
    setText("");
  };

  const handleSelectContact = (matchId) => {
    navigate("/chat/" + matchId);
  };

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
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
          />
        )}
      </div>
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
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default Chat;
