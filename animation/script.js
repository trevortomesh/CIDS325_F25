const btn = document.getElementById("showBtn");
        const msg = document.getElementById("message");
        const toggleBtn = document.getElementById("toggleMenu");
        const menu = document.getElementById("sideMenu");

        let open = false;
        let start = null;
        const duration = 1000;
        let animationId;

        toggleBtn.addEventListener("click", () => {
            cancelAnimationFrame(animationId);
            start = null;

            const startPos = open ? 0 : -100;
            const endPos = open ? -100 : 0;

            function step(timestamp){
                if(!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed/duration, 1);
                const x = startPos + (endPos - startPos) * progress;
                menu.style.left = x + "px";

                if(progress < 1){
                    animationId = requestAnimationFrame(step);
                }else{
                    open = !open;
                    }
                }

                animationId = requestAnimationFrame(step);

        });

        btn.addEventListener("click", () => {
            msg.classList.remove("is-hidden");
            //msg.style.opacity = "1";
            requestAnimationFrame(() => {
                msg.classList.add("is-shown");
            });
        });