#include<bits/stdc++.h>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int M=50;
const int N=355;
int f[M][M][M][M],cnt[10],a[N]; 
int n,m;

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)a[i]=read();
	for(int i=1;i<=m;i++){
		int bi=read();
		cnt[bi]++;
	}
	f[0][0][0][0]=a[1];
	for(int C1=0;C1<=cnt[1];C1++){
		for(int C2=0;C2<=cnt[2];C2++){
			for(int C3=0;C3<=cnt[3];C3++){
				for(int C4=0;C4<=cnt[4];C4++){
					if(C1==0&&C2==0&&C3==0&&C4==0)continue;
					int tmp=0;
					if(C1>0)tmp=max(tmp,f[C1-1][C2][C3][C4]);
					if(C2>0)tmp=max(tmp,f[C1][C2-1][C3][C4]);
					if(C3>0)tmp=max(tmp,f[C1][C2][C3-1][C4]);
					if(C4>0)tmp=max(tmp,f[C1][C2][C3][C4-1]);
					f[C1][C2][C3][C4]=tmp+a[C1+2*C2+3*C3+4*C4+1];
				}
			}
		}
	}
	cout<<f[cnt[1]][cnt[2]][cnt[3]][cnt[4]];
	return 0;
}

