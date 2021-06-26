//React Functions
import { useContext, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

//Imagens
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

//Componentes
import { Button } from "../components/Button"

//Sylesheets
import '../styles/auth.scss';

//Contextos
import { AuthContext } from '../contexts/AuthContext';

//Firebase
import { database } from '../services/firebase';


export function Home() {
    
    const [roomCode, setRoomCode] = useState('');

    const history = useHistory();

    const {user, signInWithGoogle} = useContext(AuthContext);

    async function handleCreateRoom(){        
        
        if(!user){
            await signInWithGoogle();
        }
        
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if (roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()){
            alert("Room does not exists.")
            return;
        }

        if (roomRef.val().endedAt){
            alert('Room already closed')
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração Simbolizando perguntas e repostas" />
                <strong>Crie salas de Q&amp;A ao vivo!</strong>
                <p>Tire todas as suas dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Logotipo da Aplicação" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua Sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value = {roomCode}
                        />
                        <Button type="submit">
                            Entrar na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}