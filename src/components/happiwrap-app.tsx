"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GiftIcon, SendIcon, UserIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  options?: string[];
}

const predefinedQuestions = [
  "What's the occasion for the gift?",
  "What's your budget range?",
  "What are the recipient's interests or hobbies?",
  "What's the age range of the recipient?",
  "Any specific preferences (e.g., eco-friendly, handmade)?",
];

export function HappiwrapApp() {
  const [activeView, setActiveView] = useState<'auth' | 'chat'>('auth');
  const [activeTab, setActiveTab] = useState("login");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to HappiWrap! I'm here to help you find the perfect gift. Let's start with a few questions.", sender: 'bot', options: ["Okay, let's begin!"] }
  ]);
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAuthSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Form submitted: ${activeTab}`);
    // In a real app, handle authentication here
    setActiveView('chat');
  };

  const handleChatSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() || (messages[messages.length - 1].options && messages[messages.length - 1].options!.length > 0)) {
      const newMessage: Message = { 
        id: messages.length + 1, 
        text: input.trim() || messages[messages.length - 1].options![0], 
        sender: 'user' 
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // Store the answer
      setAnswers([...answers, newMessage.text]);

      // Process the answer and move to the next question or suggest gifts
      setTimeout(() => {
        if (currentQuestion < predefinedQuestions.length) {
          const botResponse: Message = { 
            id: messages.length + 2, 
            text: predefinedQuestions[currentQuestion], 
            sender: 'bot',
            options: currentQuestion === predefinedQuestions.length - 1 ? ["Show me gift suggestions"] : undefined
          };
          setMessages(prevMessages => [...prevMessages, botResponse]);
          setCurrentQuestion(currentQuestion + 1);
        } else {
          // Suggest gifts based on answers
          const giftSuggestions = suggestGifts(answers);
          const suggestionsText = "Based on your answers, here are some gift suggestions:\n\n" +
            giftSuggestions.map(gift => `${gift.name} - ${gift.price}\n${gift.link}`).join("\n\n");
          const botResponse: Message = { 
            id: messages.length + 2, 
            text: suggestionsText, 
            sender: 'bot',
            options: ["Start over"]
          };
          setMessages(prevMessages => [...prevMessages, botResponse]);
        }
      }, 1000);
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === "Start over") {
      setMessages([messages[0]]);
      setCurrentQuestion(0);
      setAnswers([]);
    } else {
      setInput(option);
      handleChatSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
    }
  };

  const suggestGifts = (answers: string[]) => {
    const [occasion, budget, interests, ageRange, preferences] = answers;
    let suggestions = [];

    if (occasion.toLowerCase().includes('birthday')) {
      if (interests.toLowerCase().includes('tech')) {
        suggestions.push({ name: "Wireless Earbuds", price: "$79.99", link: "https://www.amazon.com/example-earbuds" });
      }
      if (interests.toLowerCase().includes('reading')) {
        suggestions.push({ name: "E-reader", price: "$129.99", link: "https://www.amazon.com/example-ereader" });
      }
    }

    if (occasion.toLowerCase().includes('anniversary')) {
      suggestions.push({ name: "Couples Spa Day", price: "$199.99", link: "https://www.groupon.com/example-spa-day" });
    }

    if (preferences.toLowerCase().includes('eco-friendly')) {
      suggestions.push({ name: "Reusable Water Bottle", price: "$34.99", link: "https://www.etsy.com/example-water-bottle" });
    }

    if (budget.toLowerCase().includes('under $50')) {
      suggestions.push({ name: "Scented Candle Set", price: "$29.99", link: "https://www.etsy.com/example-candles" });
    }

    // Add more gift suggestions based on the answers

    return suggestions.length > 0 ? suggestions : [{ name: "Gift Card", price: "Various", link: "https://www.amazon.com/gift-cards" }];
  };

  return (
    <div className="min-h-screen bg-[#433878] flex flex-col items-center p-4">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center">
          <GiftIcon className="h-12 w-12 text-[#FFE1FF] mr-4" />
          <h1 className="text-4xl font-bold text-[#E4B1F0]">HappiWrap</h1>
        </div>
        <p className="mt-2 text-xl text-[#E4B1F0] font-semibold text-center">Wrap Your World in Happiness with HappiWrap</p>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-[#E4B1F0]">
          {activeView === 'auth' ? (
            <>
              <CardHeader>
                <CardTitle className="text-[#7E60BF]">Welcome to HappiWrap</CardTitle>
                <CardDescription className="text-[#7E60BF]/80">Your AI-powered gifting assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-[#433878]">
                    <TabsTrigger value="login" className="text-[#E4B1F0] data-[state=active]:bg-[#FFE1FF] data-[state=active]:text-[#7E60BF]">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="text-[#E4B1F0] data-[state=active]:bg-[#FFE1FF] data-[state=active]:text-[#7E60BF]">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={handleAuthSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[#7E60BF]">Email</Label>
                          <Input id="email" type="email" placeholder="m@example.com" required className="bg-white text-[#7E60BF] placeholder-[#7E60BF]/50 border-[#7E60BF]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-[#7E60BF]">Password</Label>
                          <Input id="password" type="password" required className="bg-white text-[#7E60BF] border-[#7E60BF]" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full mt-4 bg-[#FFE1FF] text-[#7E60BF] hover:bg-[#FFE1FF]/90">Login</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleAuthSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[#7E60BF]">Full Name</Label>
                          <Input id="name" placeholder="John Doe" required className="bg-white text-[#7E60BF] placeholder-[#7E60BF]/50 border-[#7E60BF]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[#7E60BF]">Email</Label>
                          <Input id="email" type="email" placeholder="m@example.com" required className="bg-white text-[#7E60BF] placeholder-[#7E60BF]/50 border-[#7E60BF]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-[#7E60BF]">Password</Label>
                          <Input id="password" type="password" required className="bg-white text-[#7E60BF] border-[#7E60BF]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-[#7E60BF]">Confirm Password</Label>
                          <Input id="confirm-password" type="password" required className="bg-white text-[#7E60BF] border-[#7E60BF]" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full mt-4 bg-[#FFE1FF] text-[#7E60BF] hover:bg-[#FFE1FF]/90">Sign Up</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-[#7E60BF]">AI Gift Recommender</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full pr-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                      >
                        <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-[#FFE1FF]' : 'bg-[#7E60BF]'} mr-2`}>
                            {message.sender === 'user' ? <UserIcon size={16} className="text-[#7E60BF]" /> : <GiftIcon size={16} className="text-[#FFE1FF]" />}
                          </div>
                          <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-[#FFE1FF] text-[#7E60BF]' : 'bg-[#7E60BF] text-[#FFE1FF]'}`}>
                            {message.text.split('\n').map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                            {message.options && (
                              <div className="mt-2 space-y-2">
                                {message.options.map((option, index) => (
                                  <Button
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    className="w-full bg-[#FFE1FF] text-[#7E60BF] hover:bg-[#FFE1FF]/90"
                                  >
                                    {option}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow bg-white text-[#7E60BF] placeholder-[#7E60BF]/50 border-[#7E60BF]"
                  />
                  <Button type="submit" className="bg-[#FFE1FF] text-[#7E60BF] hover:bg-[#FFE1FF]/90">
                    <SendIcon size={18} />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  )
}