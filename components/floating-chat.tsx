"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useChatStore } from "@/lib/chat-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  X,
  Minus,
  ChevronLeft,
  Send,
  Circle,
} from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import Avatar from "boring-avatars";

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function FloatingChat() {
  const { user } = usePrivy();
  const {
    conversations,
    activeConversationId,
    isChatOpen,
    isMinimized,
    totalUnreadCount,
    openChat,
    closeChat,
    toggleMinimize,
    setActiveConversation,
    sendMessage,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, messageInput.trim(), "me");
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!walletConnected) return null;

  // Chat bubble button when closed
  if (!isChatOpen) {
    return (
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border border-border bg-card shadow-2xl transition-all duration-300",
        isMinimized ? "h-14 w-80" : "h-[480px] w-80"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer"
        onClick={() => isMinimized && toggleMinimize()}
      >
        <div className="flex items-center gap-2">
          {activeConversation && !isMinimized ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveConversation(null);
                }}
                className="p-1 hover:bg-secondary rounded"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Image
                src={getAvatarUrl(
                  activeConversation.participantAvatar,
                  activeConversation.participantAddress
                )}
                alt={activeConversation.participantName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">
                  {activeConversation.participantName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Circle
                    className={cn(
                      "h-2 w-2 fill-current",
                      activeConversation.isOnline
                        ? "text-green-500"
                        : "text-gray-400"
                    )}
                  />
                  {activeConversation.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </>
          ) : (
            <>
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">Messages</span>
              {totalUnreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize();
            }}
            className="p-1 hover:bg-secondary rounded"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeChat();
            }}
            className="p-1 hover:bg-secondary rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-xl px-3 py-2",
                        message.senderId === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          message.senderId === "me"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary border-0"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!messageInput.trim()}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Conversation List */
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                  <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs">Start chatting with other trainers!</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors border-b border-border/50",
                      conversation.unreadCount > 0 && "bg-primary/5"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar
                      name={conversation.walletAddress}
                      />
                      <Circle
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 fill-current border-2 border-card rounded-full",
                          conversation.isOnline
                            ? "text-green-500"
                            : "text-gray-400"
                        )}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "text-sm truncate",
                            conversation.unreadCount > 0
                              ? "font-bold"
                              : "font-medium"
                          )}
                        >
                          {conversation.participantName}
                        </p>
                        {conversation.lastMessage && (
                          <span className="text-[10px] text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p
                          className={cn(
                            "text-xs truncate",
                            conversation.unreadCount > 0
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {conversation.lastMessage.senderId === "me"
                            ? "You: "
                            : ""}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
