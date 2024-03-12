import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import {
	InputAdornment,
	IconButton
} from '@material-ui/core';
import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import background from "../../assets/background.jpg";
import { Instagram, WhatsApp, YouTube } from "@material-ui/icons";
import atendenteImage from "../../assets/atendente.png";

const useStyles = makeStyles(theme => ({
	paper: {
		backgroundColor: 'rgba(15, 27, 32, 0.7)',
		display: "flex",		
		flexDirection: "column",
		alignItems: "center",
        padding: "55px 30px",
	    borderRadius: "12px 12px 12px 12px", // Remova a vírgula extra
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	root: {
		display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: '100vh',
        backgroundImage: `url(${background})`, // Adicione o plano de fundo aqui
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
	},
	
	helpButton: {
		// Estilos para o botão de ajuda
		position: "fixed",
		bottom: theme.spacing(4),
		right: theme.spacing(4),
		zIndex: 9999,
		backgroundColor: "#128C7E",
		borderRadius: "50%",
		width: "70px",
		height: "70px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
		cursor: "pointer",
		"&:hover": {
		  backgroundColor: "#0D6A58",
		},
	  },
	  helpIcon: {
		// Estilos para a imagem do botão de ajuda
		width: "80px", // Ajuste o tamanho da imagem do atendente
		height: "80px", // Ajuste o tamanho da imagem do atendente
		objectFit: "cover", // Evita que a imagem seja distorcida
		borderRadius: "50%", // Deixa a imagem redonda
	  },
	  balloonContainer: {
		position: "fixed",
		bottom: theme.spacing(8), // Posicionamento da frase em relação ao botão
		right: theme.spacing(10), // Posicionamento da frase em relação ao botão
		padding: theme.spacing(2),
		borderRadius: "20px", // Borda arredondada para simular um balão de fala
		backgroundColor: "#25D366", // Cor verde padrão do WhatsApp
		color: "white",
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
		display: "flex",
		alignItems: "center",
		maxWidth: "300px", // Ajuste a largura máxima do balão de fala
		"& > img": {
		  marginRight: theme.spacing(2), // Espaçamento entre a imagem e o texto
		  width: "60px", // Ajuste o tamanho da imagem do atendente
		  height: "60px", // Ajuste o tamanho da imagem do atendente
		  objectFit: "cover", // Evita que a imagem seja distorcida
		  borderRadius: "50%", // Deixa a imagem redonda
		},
		"& > div": {
		  display: "flex",
		  flexDirection: "column",
		},
		"& > div > p": {
		  margin: 0,
		  fontWeight: "bold",
		},
		"& > div > span": {
		  fontSize: "0.9rem",
		},
		"& > svg": {
		  marginLeft: "auto", // Alinha o ícone de fechar à direita
		  cursor: "pointer",
		  width: "16px", // Ajuste o tamanho do ícone de fechar
		  height: "16px", // Ajuste o tamanho do ícone de fechar
		  color: "white",
		  borderRadius: "50%",
		  backgroundColor: "#128C7E",
		  padding: theme.spacing(1),
		  "&:hover": {
			backgroundColor: "#0D6A58",
		  },
		},
	  },
	  links: {
		"& > a + a": {
			marginLeft: "15px"
		}
	  }
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [isHelpTextVisible, setHelpTextVisible] = useState(true);

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};
	const openInNewTab = url => {
		window.open(url, '_blank', 'noopener,noreferrer');
	};
	
	const redirecionarParaWhatsApp = () => {
	  const numeroWhatsApp = "+27989001165";
	  const mensagem = "Olá! Gostaria de saber mais informações sobre o Chatbot Solutions.";
	  const mensagemCodificada = encodeURIComponent(mensagem);
	  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`, "_blank");
	};

	useEffect(() => {
		const textContainer = document.getElementById("helpTextContainer");
		let showText = true;
		const intervalId = setInterval(() => {
		  showText = !showText;
		  textContainer.style.display = showText ? "block" : "none";
		}, 5000);
	
		return () => {
		  clearInterval(intervalId);
		};
	}, []);

	return (
		<>
		<div className={classes.root}>
		<Container component="main" maxWidth="xs" className={classes.main}>
			<CssBaseline />
			<div className={classes.paper}>
				<div>
					<img style={{ margin: "0 auto", height: '100px', width: '100%',alignSelf: 'center' }} src={logo} alt="Whats" />
				</div>
				{/* <Typography component="h1" variant="h5">
					{i18n.t("login.title")}
				</Typography> */}
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label={i18n.t("login.form.email")}
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						{i18n.t("login.buttons.submit")}
					</Button>
					<Grid container>
						<Grid item>
							<Link
								href="#"
								variant="body2"
								component={RouterLink}
								to="/forgetpsw"
									>
									{i18n.t("Esqueci minha senha")}
								</Link>
							</Grid>
							<Grid item>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/signup"
								>
									{i18n.t("login.buttons.register")}
								</Link>
							</Grid>
						</Grid>
					<Box mt={3} mb={1} className={classes.links}>
						<IconButton href="https://instagram.com/chatbootatendimentos/==">
							<Instagram style={{color: "#C13584"}}/>
						</IconButton>

						<IconButton href="https://youtube.com/channel/UCflGVM6NLjZyftA-ymn0Zmg">
							<YouTube style={{color: "#FF0000"}} />
						</IconButton>
						<IconButton onClick={redirecionarParaWhatsApp} href="#">
							<WhatsApp style={{color: "#25D366"}} />
						</IconButton>
					</Box>
				</form>
			</div>
		</Container>
		</div>
		<Box>
			<div className={classes.helpButton} onClick={redirecionarParaWhatsApp}>
				<img src={atendenteImage} alt="Botão de Ajuda" className={classes.helpIcon} />
			</div>
			{isHelpTextVisible && (
			<div id="helpTextContainer" className={classes.balloonContainer}>
				<div>
					<p>Transforme o WhatsApp da sua empresa com o Chatbot Solutions.</p>
					<span>Converse comigo agora?</span>
				</div>
			</div>
			)}
		</Box>
	</>
	);
};

export default Login;