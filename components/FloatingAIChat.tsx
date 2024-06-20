'use client'
import { useEffect, useState } from 'react';
import { Message, useAssistant } from 'ai/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCurrentUser } from './context/CurrentUserContext';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Typewriter } from 'react-simple-typewriter'
import GifAnimation from './lottie-icon-animations/GifAnimation';

export default function FloatingAIChat() {
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
    const { status, messages, input, submitMessage, handleInputChange } = useAssistant({ api: '/api/openai' });
    const { currentUser } = useCurrentUser();

    console.log("messages: ", messages)
    console.log("status: ", status)
    console.log("input: ", input)
    const isInputDisabled = status !== 'awaiting_message';

    return (
        <>
            <Popover open={aiAssistantOpen} onOpenChange={setAiAssistantOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline"
                        className=" z-50 fixed bottom-4 flex flex-col right-4 h-fit gap-2 rounded-lg border-2 shadow-lg focus:outline-none">
                        <Image
                            className="rounded-full border-2"
                            src={'/MIADP-Assistant.png'}
                            alt={'MIADP AI Assistant Logo'}
                            width={30}
                            height={30}
                        />
                        Ask AI
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[99%] sm:w-[30rem] h-[35rem] p-0 rounded-lg shadow-lg flex flex-col sm:mr-4">
                    <div className="flex justify-between items-center p-4 rounded-t-lg">
                        <div className='flex flex-row gap-1 items-center'>
                            <Image
                                className="rounded-full border-3 mr-1"
                                src={'/MIADP-Assistant.png'}
                                alt={'MIADP AI Assistant Logo'}
                                width={40}
                                height={40}
                            />
                            <Label className='font-bold'> MIADP Assistant</Label>
                            <div className={`rounded-full w-3 h-3 border-1 ${status ? 'bg-green-500' : 'bg-red-500'} border-white`}></div>
                            <Label>{status ? 'online' : 'offline'}</Label>
                        </div>
                        <button onClick={() => setAiAssistantOpen(false)} className="text-xl font-bold">&times;</button>
                    </div>
                    <Separator />
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-rounded-full">
                        {messages.map((m: Message) => (
                            <div key={m.id}>
                                <div className={`mb-2 p-2 rounded-lg w-fit flex-col`}>
                                    {m.role === 'user' ? (
                                        <div>
                                            <Label className='font-semibold'>{`${currentUser?.name?.split(' ')[0]}`}</Label></div>
                                    ) : (
                                        <div className='flex flex-row items-center gap-1 mb-2'>
                                            <Image
                                                className="rounded-full border-3"
                                                src={'/MIADP-Assistant.png'}
                                                alt={'MIADP AI Assistant Logo'}
                                                width={25}
                                                height={25}
                                            />
                                            <Label>Assistant</Label>
                                        </div>

                                    )}
                                    {m.role !== 'data' ? (
                                        <div>
                                            <Label>
                                                <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*/g, '').replace(/\n/g, '<br/>') }} />
                                            </Label>
                                        </div>
                                    ) : (
                                        <>
                                            <span>{(m.data as any).description}</span>
                                            <br />
                                            <pre className="bg-gray-200 p-2 rounded mt-2">
                                                {JSON.stringify(m.data, null, 2)}
                                            </pre>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}


                        {status === 'in_progress' && (
                            // <div className="mb-4 text-center text-gray-500">
                            //     Typing...
                            // </div>
                            <GifAnimation src="/lottie/loading.gif" width={25} height={25} />

                        )}

                    </div>

                    <form onSubmit={submitMessage} className="p-4 rounded-b-lg flex gap-2 relative">

                        {!input && messages.length == 0 && (
                            <div className="absolute inset-y-0 left-4 ml-4 flex items-center pointer-events-none">
                                <Label className='text-gray-500'>
                                    <Typewriter
                                        words={[
                                            'Hi!',
                                            'Ask me anything...',
                                            'What is MIADP?',
                                            'Unsa ang MIADP?',
                                            'Ano ang MIADP?',
                                            'Need assistance? Just ask!',
                                        ]}
                                        loop={5}
                                        cursor
                                        cursorStyle='_'
                                        typeSpeed={40}
                                        deleteSpeed={30}
                                    />
                                </Label>

                            </div>
                        )}
                        <Input
                            disabled={isInputDisabled}
                            value={input}
                            onChange={handleInputChange}
                            className="border rounded-l-md focus:outline-none focus:ring-2 bg-transparent overflow-hidden"
                        />
                        <Button
                            type="submit"
                            variant={'outline'}
                            disabled={status !== 'awaiting_message'}
                            className="rounded-r-md"
                        >
                            Send
                        </Button>
                    </form>
                </PopoverContent>
            </Popover >
        </>
    );
}
